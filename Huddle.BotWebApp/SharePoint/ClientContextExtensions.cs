using Microsoft.SharePoint.Client;

namespace Huddle.BotWebApp.SharePoint
{
    public static class ClientContextExtensions
    {
        public static ListItemCollection GetItems(this ClientContext clientContext, string listTitle, CamlQuery query)
        {
            var web = clientContext.Site.RootWeb;
            var list = web.Lists.GetByTitle(listTitle);
            var items = list.GetItems(query);
            clientContext.Load(items);
            clientContext.ExecuteQuery();
            return items;
        }
    }
}