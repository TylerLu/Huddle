using Huddle.Common;
using Huddle.MetricWebApp.Infrastructure;
using Huddle.MetricWebApp.Models;
using Microsoft.SharePoint.Client;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Huddle.MetricWebApp.SharePoint
{
    public class ReasonsService
    {
        public static async Task<Reason[]> GetReasonsByMetricIdAsync( int metricId)
        {
            
            var filter = string.Format(@"
                    <Eq>
                        <FieldRef Name='{0}' LookupId='TRUE'/>
                        <Value Type='Lookup'>{1}</Value> 
                    </Eq>                   
                ", SPLists.Reasons.Columns.Metric, metricId);

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

        public static async Task<Reason> GetReasonById(int reasonId)
        {

            var reason = new Reason();
            using (var clientContext = await (AuthenticationHelper.GetSharePointClientContextAsync(Permissions.Application)))
            {
                var query = new CamlQuery();
                query.ViewXml =
                    @"<View>
                    <Query>
                        <Where>
                            <Eq>
                                <FieldRef Name='" + SPLists.Reasons.Columns.ID + @"'/>
                                <Value Type='int'>" + reasonId + @"</Value>
                            </Eq>
                        </Where>
                        </Query>
                </View>";
                var items = clientContext.GetItems(SPLists.Reasons.Title, query);
                var queryItem = items.FirstOrDefault();
                if (queryItem == null)
                    return reason;
                reason = queryItem.ToReason();
                return reason;
            }

        }



        public static async Task InsertItemAsync(Reason item)
        {
            using (var clientContext = await (AuthenticationHelper.GetSharePointClientContextAsync(Permissions.Application)))
            {
                var list = clientContext.Web.Lists.GetByTitle(SPLists.Reasons.Title); 
                ListItemCreationInformation newItem = new ListItemCreationInformation();
                ListItem listItem = list.AddItem(new ListItemCreationInformation());
                listItem[SPLists.Reasons.Columns.Metric] = SharePointHelper.BuildSingleLookFieldValue(item.Metric.Id, item.Metric.Name);
                listItem[SPLists.Reasons.Columns.Title] = item.Name;
                listItem[SPLists.Reasons.Columns.State] = 1;
                listItem[SPLists.Reasons.Columns.ReasonTracking] = item.ReasonTracking;
                listItem[SPLists.Reasons.Columns.ValueType] = item.ValueType;
                listItem[SPLists.Reasons.Columns.TrackingFrequency] =Convert.ToString(item.TrackingFrequency);
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
                queryItem[SPLists.Reasons.Columns.Title] = item.Name;
                queryItem[SPLists.Reasons.Columns.State] = item.State;
                queryItem[SPLists.Reasons.Columns.ReasonTracking] = item.ReasonTracking;
                queryItem[SPLists.Reasons.Columns.ValueType] = item.ValueType;
                queryItem[SPLists.Reasons.Columns.TrackingFrequency] = Convert.ToString(item.TrackingFrequency);
                queryItem.Update();
                clientContext.ExecuteQuery();
            }
        }

        public static async Task UpdateReasonStatus(int reasonid)
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
                                    <Value Type='int'>" + reasonid + @"</Value>
                                </Eq>
                            </Where>
                         </Query>
                    </View>";
                var items = clientContext.GetItems(SPLists.Reasons.Title, query);
                var queryItem = items.FirstOrDefault();
                if (queryItem == null)
                    return;
                var status =Convert.ToInt32( queryItem[SPLists.Reasons.Columns.State]);
                if(status==0)
                    queryItem[SPLists.Reasons.Columns.State] = 1;
                else
                    queryItem[SPLists.Reasons.Columns.State] = 0;
                queryItem.Update();
                clientContext.ExecuteQuery();
            }
        }

        private static string GetMetricFilters(int[] metricIds)
        {
            if (metricIds.Length == 0)
                return "";
            string result = "<Or>";
            for (var i = 0; i < metricIds.Length; i++)
            {
                result +=string.Format("<Eq><FieldRef Name='{0}' LookupId='TRUE'/><Value Type='Lookup'>{1}</Value> </Eq>", SPLists.Reasons.Columns.Metric,metricIds[i]);
            }
            result += "</Or>";
            return result;
        }
    }
}