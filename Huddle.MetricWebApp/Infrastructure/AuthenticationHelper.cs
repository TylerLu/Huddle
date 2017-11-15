using Huddle.MetricWebApp.Models;
using Microsoft.Azure.ActiveDirectory.GraphClient;
using Microsoft.Graph;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;
using System.Web;
using SP = Microsoft.SharePoint.Client;

namespace Huddle.MetricWebApp.Infrastructure
{
    public enum Permissions
    {
        /// <summary>
        /// The client accesses the web API as the signed-in user.
        /// </summary>
        Delegated,
        /// <summary>
        /// The client accesses the web API directly as itself (no user context).
        /// </summary>
        /// <remarks>
        /// This type of permission requires administrator consent.
        /// </remarks>
        Application
    }

    /// <summary>
    /// A static helper class used to get access token, authentication result, authentication context and instances of service client.
    /// </summary>
    public static class AuthenticationHelper
    {
        public static readonly string AADCertThumbprint = Constants.AADClientCertThumbprint;
        /// <summary>
        /// Get an instance of ActiveDirectoryClient
        /// </summary>
        public static async Task<ActiveDirectoryClient> GetActiveDirectoryClientAsync(Permissions permissions = Permissions.Delegated)
        {
            var accessToken = await GetAccessTokenAsync(Constants.Resources.AADGraph, permissions);
            var serviceRoot = new Uri(new Uri(Constants.Resources.AADGraph), ClaimsPrincipal.Current.GetTenantId());
            return new ActiveDirectoryClient(serviceRoot, () => Task.FromResult(accessToken));
        }

        /// <summary>
        /// Get an instance of GraphServiceClient
        /// </summary>
        public static async Task<GraphServiceClient> GetGraphServiceClientAsync(Permissions permissions = Permissions.Delegated)
        {
            var accessToken = await GetAccessTokenAsync(Constants.Resources.MSGraph, permissions);
            var serviceRoot = Constants.Resources.MSGraph + "/v1.0/" + ClaimsPrincipal.Current.GetTenantId();
            return new GraphServiceClient(serviceRoot, new BearerAuthenticationProvider(accessToken));
        }

        public static async Task<SP.ClientContext> GetSharePointClientContextAsync(string url, Permissions permissions = Permissions.Delegated)
        {
            var resourceId = GetSharePointResourceId(url);
            var token = await GetAccessTokenAsync(resourceId, permissions);
            return GetSharePointClientContext(url, token);
        }

        public static async Task<SP.ClientContext> GetSharePointClientContextAsync(Permissions permissions = Permissions.Delegated)
        {
            var resourceId = GetSharePointResourceId(Constants.BaseSPSiteUrl);
            var token = await GetAccessTokenAsync(resourceId, permissions);
            return GetSharePointClientContext(Constants.BaseSPSiteUrl, token);
        }


        ///// <summary>
        ///// Get an instance of ActiveDirectoryClient from the specified AuthenticationResult
        ///// </summary>
        //public static ActiveDirectoryClient GetActiveDirectoryClient(AuthenticationResult result)
        //{
        //    var serviceRoot = new Uri(new Uri(Constants.Resources.AADGraph), result.TenantId);
        //    return new ActiveDirectoryClient(serviceRoot, () => Task.FromResult(result.AccessToken));
        //}

        ///// <summary>
        ///// Get an instance of GraphServiceClient from the specified AuthenticationResult
        ///// </summary>
        //public static GraphServiceClient GetGraphServiceClient(AuthenticationResult result)
        //{
        //    var serviceRoot = Constants.Resources.MSGraph + "/v1.0/" + ClaimsPrincipal.Current.GetTenantId();
        //    return new GraphServiceClient(serviceRoot, new BearerAuthenticationProvider(result.AccessToken));
        //}

        /// <summary>
        /// Get an access token of the specified resource
        /// </summary>
        public static async Task<string> GetAccessTokenAsync(string resource, Permissions permissions = Permissions.Delegated)
        {
            var result = await GetAuthenticationResult(resource, permissions);
            return result.AccessToken;
        }

        /// <summary>
        /// Get an AuthenticationResult of the specified resource
        /// </summary>
        public static Task<AuthenticationResult> GetAuthenticationResult(string resource, Permissions permissions)
        {
            var context = GetAuthenticationContext(ClaimsPrincipal.Current.Identity as ClaimsIdentity, permissions);
            var clientCredential = new ClientCredential(Constants.AADClientId, Constants.AADClientSecret);

            if (permissions == Permissions.Delegated)
            {
                var userObjectId = ClaimsPrincipal.Current.GetObjectIdentifier();
                var userIdentifier = new UserIdentifier(userObjectId, UserIdentifierType.UniqueId);
                return context.AcquireTokenSilentAsync(resource, clientCredential, userIdentifier);
            }
            else if (permissions == Permissions.Application)
            {
                var cert = GetX509Certificate();
                if (cert == null)
                    throw new Exception("Could not find Client Assertion Certificate with thumbprint " + Constants.AADClientCertThumbprint);

                var clientCert = new ClientAssertionCertificate(Constants.AADClientId, cert);
                return context.AcquireTokenAsync(resource, clientCert);
            }
            else
                throw new NotImplementedException();
        }

        /// <summary>
        /// Get an instance of AuthenticationContext
        /// </summary>
        public static AuthenticationContext GetAuthenticationContext(ClaimsIdentity claimsIdentity, Permissions permissions)
        {
            var tenantID = claimsIdentity.GetTenantId();
            var userId = claimsIdentity.GetObjectIdentifier();
            var signedInUserID = permissions == Permissions.Delegated ? userId : tenantID;

            var authority = string.Format("{0}{1}", Constants.AADInstance, tenantID);
            var tokenCache = ADALTokenCache.Create(signedInUserID);
            return new AuthenticationContext(authority, tokenCache);
        }

        /// <summary>
        /// Get an AuthenticationResult from the specified authorization code
        /// </summary>
        public static async Task<AuthenticationResult> GetAuthenticationResultAsync(string authorizationCode)
        {
            var credential = new ClientCredential(Constants.AADClientId, Constants.AADClientSecret);
            var authContext = new AuthenticationContext(Constants.Authority);
            var redirectUri = new Uri(HttpContext.Current.Request.Url.GetLeftPart(UriPartial.Path));
            return await authContext.AcquireTokenByAuthorizationCodeAsync(authorizationCode, redirectUri, credential);
        }

        /// <summary>
        /// Get an App-only access token for a daemon app
        /// </summary>
        //public static async Task<string> GetAppOnlyAccessTokenForDaemonAppAsync(string resource, string certPath, string certPassword, string tenantId)
        //{
        //    var authority = string.Format("{0}{1}", Constants.AADInstance, tenantId);
        //    var authenticationContext = new AuthenticationContext(authority, false);
        //    var cert = GetClientAssertionCertificate(certPath, certPassword);
        //    var authenticationResult = await authenticationContext.AcquireTokenAsync(resource, cert);
        //    return authenticationResult.AccessToken;
        //}

        //private static ClientAssertionCertificate GetClientAssertionCertificate(string certPath, string certPassword)
        //{
        //    var certData = System.IO.File.ReadAllBytes(certPath);
        //    var flags = X509KeyStorageFlags.Exportable | X509KeyStorageFlags.MachineKeySet | X509KeyStorageFlags.PersistKeySet;
        //    var cert = new X509Certificate2(certData, certPassword, flags);
        //    return new ClientAssertionCertificate(Constants.AADClientId, cert);
        //}

        private static string GetSharePointResourceId(string siteCollectionUrl)
        {
            var url = new Uri(siteCollectionUrl);
            return url.GetComponents(UriComponents.SchemeAndServer, UriFormat.Unescaped);
        }

        private static SP.ClientContext GetSharePointClientContext(string url, string token)
        {
            var clientContext = new SP.ClientContext(url)
            {
                AuthenticationMode = SP.ClientAuthenticationMode.Anonymous,
                FormDigestHandlingEnabled = false
            };
            clientContext.ExecutingWebRequest += (sender, args) =>
                    args.WebRequestExecutor.WebRequest.Headers["Authorization"] = "Bearer " + token;
            return clientContext;
        }


        public static async Task<string> GetAccessTokenForAppAsync(string resource)
        {
            var authenticationContext = new AuthenticationContext(Constants.Authority, false);
            var clientAssertionCertificate = GetClientAssertionCertificate();
            var authenticationResult = await authenticationContext.AcquireTokenAsync(resource, clientAssertionCertificate);
            return authenticationResult.AccessToken;
        }

        internal static ClientAssertionCertificate GetClientAssertionCertificate()
        {
            var cert = GetX509Certificate();
            if (cert == null)
                throw new Exception("Could not find Client Assertion Certificate with thumbprint " + Constants.AADClientCertThumbprint);
            return new ClientAssertionCertificate(Constants.AADClientId, cert);
        }

        private static X509Certificate2 GetX509Certificate()
        {
            using (var store = new X509Store(StoreName.My, StoreLocation.CurrentUser))
            {
                store.Open(OpenFlags.ReadOnly);
                return store.Certificates.OfType<X509Certificate2>().FirstOrDefault(i => i.Thumbprint == Constants.AADClientCertThumbprint);
            }
        }
    }
}