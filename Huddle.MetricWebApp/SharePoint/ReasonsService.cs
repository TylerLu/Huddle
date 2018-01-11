using Huddle.Common;
using Huddle.MetricWebApp.Infrastructure;
using Huddle.MetricWebApp.Models;
using Microsoft.SharePoint.Client;
using System.Linq;
using System.Threading.Tasks;

namespace Huddle.MetricWebApp.SharePoint
{
    public class ReasonsService
    {
        public static async Task<Reason[]> GetItemsAsync(int state, int issueId)
        {
            var filter = string.Format(@"<And>
                    <Eq>
                        <FieldRef Name='{0}' />
                        <Value Type='Choice'>{1}</Value>
                    </Eq>
                    <Eq>
                        <FieldRef Name='{2}' LookupId='TRUE'/>
                        <Value Type='Lookup'>{3}</Value>
                    </Eq>
                </And>", SPLists.Reasons.Columns.State, state,SPLists.Reasons.Columns.Issue, issueId);

            var query = new CamlQuery();
            query.ViewXml = string.Format("<View><Query><Where>{0}</Where></Query></View>", filter);

            using (var clientContext = await (AuthenticationHelper.GetSharePointClientContextAsync(Permissions.Application)))
            {
                var items = clientContext.GetItems(SPLists.Reasons.Title, query);

                var reasonArray = items.Select(item => item.ToReason())
                     .OrderBy(item => item.Id)
                     .ToArray();
                return reasonArray;
            }
        }

        public static async Task InsertItemAsync(Reason item)
        {
            using (var clientContext = await (AuthenticationHelper.GetSharePointClientContextAsync(Permissions.Application)))
            {
                var list = clientContext.Web.Lists.GetByTitle(SPLists.Reasons.Title); 
                ListItemCreationInformation newItem = new ListItemCreationInformation();
                ListItem listItem = list.AddItem(new ListItemCreationInformation());
                listItem[SPLists.Reasons.Columns.Issue] = SharePointHelper.BuildSingleLookFieldValue(item.Issue.Id, item.Issue.Name);
                listItem[SPLists.Reasons.Columns.Title] = item.Name;
                listItem[SPLists.Reasons.Columns.State] = item.State;
                listItem.Update();
                clientContext.Load(listItem);
                clientContext.ExecuteQuery();
                item.Id = listItem.Id;
            }
        }

        public static async Task UpdateItemAsync(Reason item)
        {
            using (var clientContext = await (AuthenticationHelper.GetSharePointClientContextAsync(Permissions.Application)))
            {
                var query = new CamlQuery();
                query.ViewXml =
                    @"<View>
                        <Query>
                            <Where>
                                <Eq>
                                    <FieldRef Name='" + SPLists.Reasons.Columns.ID + @"'/>
                                    <Value Type='int'>" + item.Id + @"</Value>
                                </Eq>
                            </Where>
                         </Query>
                    </View>";
                var items = clientContext.GetItems(SPLists.Reasons.Title, query);
                var queryItem = items.FirstOrDefault();
                if (queryItem == null)
                    return;
                queryItem[SPLists.Reasons.Columns.State] = item.State;
                queryItem[SPLists.Reasons.Columns.Title] = item.Name;
                queryItem.Update();
                clientContext.ExecuteQuery();
            }
        }
    }
}