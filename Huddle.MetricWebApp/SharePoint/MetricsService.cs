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

    }
}