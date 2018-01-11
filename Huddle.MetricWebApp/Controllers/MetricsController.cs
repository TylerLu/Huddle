using Huddle.MetricWebApp.SharePoint;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Huddle.MetricWebApp.Util;

namespace Huddle.MetricWebApp.Controllers
{
    public class MetricsController : BaseAPIController
    {
        public async Task<HttpResponseMessage> Get(int id)
        {
            var metricArray = await MetricsService.GetItemsAsync(id);
            var result = metricArray.Select(metric => metric.ToJson()).ToArray();
            return ToJson(result);
        }
    }
}