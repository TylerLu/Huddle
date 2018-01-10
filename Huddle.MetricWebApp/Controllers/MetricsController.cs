using Huddle.MetricWebApp.SharePoint;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Huddle.MetricWebApp.Util;
using Newtonsoft.Json.Linq;
using Huddle.MetricWebApp.Models;

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

    public class MetricController : BaseAPIController
    {


        [HttpPost]
        public async Task<HttpResponseMessage> Post(JObject objData)
        {
            dynamic jsonData = objData;
            JObject metric = jsonData.metric;
            var toAddMetric = metric.ToObject<Metric>();
            await MetricsService.InsertItemAsync(toAddMetric);
            return ToJson(new
            {
                issueId = toAddMetric.Id
            });
        }

        [HttpGet, Route("api/metrics/GetMetricById/{id}")]
        public async Task<HttpResponseMessage> GetMetricById(int id)
        {
            var metric = await MetricsService.GetMetricById(id);
            return ToJson(metric.ToJson());

        }


    }

    public class MetricEditController : BaseAPIController
    {
        [HttpPost]
        public async Task<HttpResponseMessage> EditMetric(JObject objData)
        {
            dynamic jsonData = objData;
            JObject metric = jsonData.metric;
            var toEditMetric = metric.ToObject<Metric>();
            await MetricsService.UpdateItemAsync(toEditMetric);
            return ToJson(new
            {
                issueId = toEditMetric.Id
            });
        }
    }
}