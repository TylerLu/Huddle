using System;
using System.Collections.Generic;
using System.Configuration;
using System.Globalization;
using System.IdentityModel.Claims;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.OpenIdConnect;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using Owin;
using Huddle.BotWebApp.Models;
using Huddle.BotWebApp.Utils;

namespace Huddle.BotWebApp
{
    public partial class Startup
    {
        public void ConfigureAuth(IAppBuilder app)
        {
            // ApplicationDbContext db = new ApplicationDbContext();

            app.SetDefaultSignInAsAuthenticationType(CookieAuthenticationDefaults.AuthenticationType);

            app.UseCookieAuthentication(new CookieAuthenticationOptions());

            app.UseOpenIdConnectAuthentication(
                new OpenIdConnectAuthenticationOptions
                {
                    ClientId = Constants.AADClientId,
                    Authority = Constants.Authority,

                    Notifications = new OpenIdConnectAuthenticationNotifications()
                    {
                        RedirectToIdentityProvider = (context) =>
                        {
                            // This ensures that the address used for sign in and sign out is picked up dynamically from the request
                            // this allows you to deploy your app (to Azure Web Sites, for example)without having to change settings
                            // Remember that the base URL of the address used here must be provisioned in Azure AD beforehand.
                            string appBaseUrl = context.Request.Scheme + "://" + context.Request.Host + context.Request.PathBase;
                            context.ProtocolMessage.RedirectUri = appBaseUrl + "/";
                            context.ProtocolMessage.PostLogoutRedirectUri = appBaseUrl;

                            var loginHint = context.Request.Query.Get("loginHint");
                            if (!string.IsNullOrEmpty(loginHint))
                                context.ProtocolMessage.LoginHint = loginHint;

                            var prompt = context.Request.Query.Get("prompt");
                            if (!string.IsNullOrEmpty(prompt))
                                context.ProtocolMessage.Prompt = prompt;

                            return Task.FromResult(0);
                        },


                        // If there is a code in the OpenID Connect response, redeem it for an access token and refresh token, and store those away.
                        AuthorizationCodeReceived = async context =>
                        {
                            var identity = context.AuthenticationTicket.Identity;

                            // Get token with authorization code
                            var redirectUri = new Uri(HttpContext.Current.Request.Url.GetLeftPart(UriPartial.Path));
                            var credential = new ClientCredential(Constants.AADClientId, Constants.AADClientSecret);
                            var authContext = AuthenticationHelper.GetAuthenticationContext(identity, Permissions.Delegated);
                            var authResult = await authContext.AcquireTokenByAuthorizationCodeAsync(context.Code, redirectUri, credential, Constants.Resources.MSGraph);
                        }
                    }
                });
        }
    }
}
