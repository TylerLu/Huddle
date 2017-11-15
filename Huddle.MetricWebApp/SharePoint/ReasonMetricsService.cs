using Huddle.Common;
using Huddle.MetricWebApp.Infrastructure;
using Huddle.MetricWebApp.Models;
using Microsoft.SharePoint.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Huddle.MetricWebApp.SharePoint
{
    public class ReasonMetricsService
    {
        public static async Task<List<ReasonMetric[]>> GetItemsAsync(List<string> reasonIds, DateTime weekStartDate)
        {


            using (var clientContext = await (AuthenticationHelper.GetSharePointClientContextAsync(Permissions.Application)))
            {
                var startUTC = weekStartDate.ToISO8601DateTimeString();
                var endUTC = weekStartDate.AddDays(7).ToISO8601DateTimeString();
                var reasonIdQuery = @"<In>
                                             <FieldRef Name='{0}' LookupId='TRUE'/>
                                             <Values>"
                                            + string.Join("",reasonIds.Select(readId=>{ return @"<Value Type='Lookup'>" + readId + "</Value>"; }))
                                            +@"</Values>
                                    </In>";
                var filter = string.Format(@"<And>"
                        +reasonIdQuery
                        +@"<And>
                            <Geq>
                                <FieldRef Name='{1}' />
                                <Value IncludeTimeValue='TRUE' StorageTZ='TRUE' Type='DateTime'>{2}</Value>
                            </Geq>
                            <Leq>
                                <FieldRef Name='{1}' />
                                <Value IncludeTimeValue='TRUE' StorageTZ='TRUE' Type='DateTime'>{3}</Value>
                            </Leq>
                        </And>
                </And>", SPLists.ReasonMetrics.Columns.Reason,SPLists.ReasonMetrics.Columns.InputDate, startUTC, endUTC);

                var query = new CamlQuery();
                query.ViewXml = string.Format("<View><Query><Where>{0}</Where></Query></View>", filter);

                var items = clientContext.GetItems(SPLists.ReasonMetrics.Title, query);
                return items.Select(item => item.ToReasonMetric())
                            .GroupBy(item => item.Reason.Id)
                            .Select(grp => grp.ToArray())
                            .ToList();
            }
        }

        public static async Task InsertItemAsync(ReasonMetric item)
        {
            using (var clientContext = await (AuthenticationHelper.GetSharePointClientContextAsync(Permissions.Application)))
            {
                var list = clientContext.Web.Lists.GetByTitle(SPLists.ReasonMetrics.Title); ;
                ListItemCreationInformation newItem = new ListItemCreationInformation();
                ListItem listItem = list.AddItem(new ListItemCreationInformation());
                listItem[SPLists.ReasonMetrics.Columns.Reason] = SharePointHelper.BuildSingleLookFieldValue(item.Reason.Id, item.Reason.Name);
                listItem[SPLists.ReasonMetrics.Columns.InputDate] = item.InputDate;
                listItem[SPLists.ReasonMetrics.Columns.ReasonMetricValue] = item.ReasonMetricValues;
                listItem.Update();
                clientContext.Load(listItem);
                clientContext.ExecuteQuery();
                item.Id = listItem.Id;
            }
        }

        public static async Task UpdateItemAsync(ReasonMetric item)
        {
            using (var clientContext = await (AuthenticationHelper.GetSharePointClientContextAsync(Permissions.Application)))
            {
                var query = new CamlQuery();
                query.ViewXml =
                    @"<View>
                        <Query>
                            <Where>
                                <Eq>
                                    <FieldRef Name='" + SPLists.ReasonMetrics.Columns.ID + @"'/>
                                    <Value Type='int'>" + item.Id + @"</Value>
                                </Eq>
                            </Where>
                         </Query>
                    </View>";
                var items = clientContext.GetItems(SPLists.ReasonMetrics.Title, query);
                var queryItem = items.FirstOrDefault();
                if (queryItem == null)
                    return;
                queryItem[SPLists.ReasonMetrics.Columns.ReasonMetricValue] = item.ReasonMetricValues;
                queryItem.Update();
                clientContext.ExecuteQuery();
            }
        }
    }
}