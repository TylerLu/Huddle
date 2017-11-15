using Microsoft.IdentityModel.Clients.ActiveDirectory;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.OpenIdConnect;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Huddle.MetricWebApp.Infrastructure
{
    /// <summary>
    /// Handle AdalException and navigate user to the authorize endpoint or /Link/LoginO365Required
    /// </summary>
    public class HandleAdalExceptionAttribute : ActionFilterAttribute, IExceptionFilter
    {
        public static readonly string ChallengeImmediatelyTempDataKey = "ChallengeImmediately";

        public void OnException(ExceptionContext filterContext)
        {
            if (!(filterContext.Exception is AdalException)) return;

            if (filterContext.HttpContext.Request.IsAjaxRequest())
            {
                filterContext.Result = new JsonResult { Data = new { error = "AdalException" } };
                filterContext.ExceptionHandled = true;
                return;
            }

            var requestUrl = filterContext.HttpContext.Request.Url.ToString();
            filterContext.HttpContext.GetOwinContext().Authentication.Challenge(
               new AuthenticationProperties { RedirectUri = requestUrl },
               OpenIdConnectAuthenticationDefaults.AuthenticationType);
            filterContext.ExceptionHandled = true;
        }
    }
}