using Huddle.MetricWebApp.Infrastructure;
using System.Web;
using System.Web.Mvc;

namespace Huddle.MetricWebApp
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
            filters.Add(new AddContentSecurityPolicyAttribute());
        }
    }
}
