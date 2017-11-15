using Huddle.Common;
using Huddle.MetricWebApp.Infrastructure;
using Huddle.MetricWebApp.Models;
using Microsoft.SharePoint.Client;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Huddle.MetricWebApp.SharePoint
{
    public class IssueMetricsService
    {
        public static async Task<IssueMetric[]> GetItemsAsync(int issueId,DateTime weekStartDate)
        {
            

            using (var clientContext = await (AuthenticationHelper.GetSharePointClientContextAsync(Permissions.Application)))
            {
                var startUTC = weekStartDate.ToISO8601DateTimeString();
                var endUTC = weekStartDate.AddDays(7).ToISO8601DateTimeString();
                var filter = string.Format(@"<And>
                    <Eq>
                        <FieldRef Name='{0}' LookupId='TRUE'/>
                        <Value Type='Lookup'>{1}</Value>
                    </Eq>
                    <And>
                        <Geq>
                            <FieldRef Name='{2}' />
                            <Value IncludeTimeValue='TRUE' Type='DateTime'>{3}</Value>
                        </Geq>
                        <Leq>
                            <FieldRef Name='{2}' />
                            <Value IncludeTimeValue='TRUE' Type='DateTime'>{4}</Value>
                        </Leq>
                    </And>
                </And>", SPLists.IssueMetrics.Columns.Issue, issueId, SPLists.IssueMetrics.Columns.InputDate, startUTC, endUTC);

                var query = new CamlQuery();
                query.ViewXml = string.Format("<View><Query><Where>{0}</Where></Query></View>", filter);

                var items = clientContext.GetItems(SPLists.IssueMetrics.Title, query);
                return items.Select(item => item.ToIssueMetric())
                            .OrderBy(i => i.InputDate)
                            .ToArray();
            }
        }

        public static async Task InsertItemAsync(IssueMetric item)
        {
            using (var clientContext = await (AuthenticationHelper.GetSharePointClientContextAsync(Permissions.Application)))
            {
                var list = clientContext.Web.Lists.GetByTitle(SPLists.IssueMetrics.Title); ;
                ListItemCreationInformation newItem = new ListItemCreationInformation();
                ListItem listItem = list.AddItem(new ListItemCreationInformation());
                listItem[SPLists.IssueMetrics.Columns.Issue] = SharePointHelper.BuildSingleLookFieldValue(item.Issue.Id, item.Issue.Name);
                listItem[SPLists.IssueMetrics.Columns.InputDate] = item.InputDate;
                listItem[SPLists.IssueMetrics.Columns.MetricValue] = item.MetricValues;
                listItem.Update();
                clientContext.Load(listItem);
                clientContext.ExecuteQuery();
                item.Id = listItem.Id;
            }
        }

        public static async Task UpdateItemAsync(IssueMetric item)
        {
            using (var clientContext = await (AuthenticationHelper.GetSharePointClientContextAsync(Permissions.Application)))
            {
                var query = new CamlQuery();
                query.ViewXml =
                    @"<View>
                        <Query>
                            <Where>
                                <Eq>
                                    <FieldRef Name='" + SPLists.IssueMetrics.Columns.ID + @"'/>
                                    <Value Type='int'>" + item.Id + @"</Value>
                                </Eq>
                            </Where>
                         </Query>
                    </View>";
                var items = clientContext.GetItems(SPLists.IssueMetrics.Title,query);
                var queryItem = items.FirstOrDefault();
                if (queryItem == null)
                    return;
                queryItem[SPLists.IssueMetrics.Columns.MetricValue] = item.MetricValues;
                queryItem.Update();
                clientContext.ExecuteQuery();
            }
        }
    }
}