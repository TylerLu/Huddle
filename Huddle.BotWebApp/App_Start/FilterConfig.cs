using Huddle.BotWebApp.Infrastructure;
using System.Web;
using System.Web.Mvc;

namespace Huddle.BotWebApp
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new LogErrorAttribute(), 100);
            filters.Add(new HandleErrorAttribute(), 1500);
        }
    }
}
