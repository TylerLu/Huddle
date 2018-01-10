using Huddle.Common;
using Huddle.MetricWebApp.Infrastructure;
using Huddle.MetricWebApp.Models;
using Microsoft.SharePoint.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace Huddle.MetricWebApp.SharePoint
{
    public class MetricsService
    {
        public static async Task<Metric[]> GetItemsAsync(int issueId)
        {
            var metric = new Metric();
            var filter = string.Format(@"
                    <Eq>
                        <FieldRef Name='{0}' LookupId='TRUE'/>
                        <Value Type='Lookup'>{1}</Value> 
                    </Eq>                   
                ",  SPLists.Metrics.Columns.Issue, issueId);

            var query = new CamlQuery();
            query.ViewXml = string.Format("<View><Query><Where>{0}</Where></Query></View>", filter);

            using (var clientContext = await (AuthenticationHelper.GetSharePointClientContextAsync(Permissions.Application)))
            {
                var items = clientContext.GetItems(SPLists.Metrics.Title, query);
                var metricArray = items.Select(item => item.ToMetric())
                     .OrderBy(item => item.Id)
                     .ToArray();
                return metricArray;
            }
        }

        public static async Task<Metric> GetMetricById(int id)
        {

            var metric = new Metric();
            using (var clientContext = await (AuthenticationHelper.GetSharePointClientContextAsync(Permissions.Application)))
            {
                var query = new CamlQuery();
                query.ViewXml =
                    @"<View>
                    <Query>
                        <Where>
                            <Eq>
                                <FieldRef Name='" + SPLists.Metrics.Columns.ID + @"'/>
                                <Value Type='int'>" + id + @"</Value>
                            </Eq>
                        </Where>
                        </Query>
                </View>";
                var items = clientContext.GetItems(SPLists.Metrics.Title, query);
                var queryItem = items.FirstOrDefault();
                if (queryItem == null)
                    return metric;
                metric = queryItem.ToMetric();
                return metric;
            }

        }

        public static async Task<int> InsertItemAsync(Metric item)
        {
            using (var clientContext = await (AuthenticationHelper.GetSharePointClientContextAsync(Permissions.Application)))
            {
           
                var list = clientContext.Web.Lists.GetByTitle(SPLists.Metrics.Title);
                ListItem listItem = list.AddItem(new ListItemCreationInformation());
                listItem[SPLists.Metrics.Columns.Issue] = SharePointHelper.BuildSingleLookFieldValue(item.Issue.Id, item.Issue.Name);
                listItem[SPLists.Metrics.Columns.Title] = item.Name;
                listItem[SPLists.Metrics.Columns.State] = 1;
                listItem[SPLists.Metrics.Columns.TargetGoal] = item.TargetGoal;
                listItem[SPLists.Metrics.Columns.ValueType] = item.ValueType;
                listItem.Update();
                clientContext.Load(listItem);
                clientContext.ExecuteQuery();
                return listItem.Id;
            }
        }
        public static async Task UpdateItemAsync(Metric item)
        {
            using (var clientContext = await (AuthenticationHelper.GetSharePointClientContextAsync(Permissions.Application)))
            {
                var query = new CamlQuery();
                query.ViewXml =
                    @"<View>
                        <Query>
                            <Where>
                                <Eq>
                                    <FieldRef Name='" + SPLists.Metrics.Columns.ID + @"'/>
                                    <Value Type='int'>" + item.Id + @"</Value>
                                </Eq>
                            </Where>
                         </Query>
                    </View>";
                var items = clientContext.GetItems(SPLists.Metrics.Title, query);
                var listItem = items.FirstOrDefault();
                if (listItem == null)
                    return ;
                listItem[SPLists.Metrics.Columns.Title] = item.Name;
                listItem[SPLists.Metrics.Columns.State] =item.State;
                listItem[SPLists.Metrics.Columns.TargetGoal] = item.TargetGoal;
                listItem[SPLists.Metrics.Columns.ValueType] = item.ValueType;
                listItem.Update();
                clientContext.Load(listItem);
                clientContext.ExecuteQuery();
                
            }
        }
        

    }
}