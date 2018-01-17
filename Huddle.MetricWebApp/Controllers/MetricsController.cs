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
            var result= await MetricsService.InsertItemAsync(toAddMetric);
            return ToJson(result.ToJson());
        }

        [HttpGet, Route("api/metrics/GetMetricById/{id}")]
        public async Task<HttpResponseMessage> GetMetricById(int id)
        {
            var metric = await MetricsService.GetMetricById(id);
            return ToJson(metric.ToJson());

        }

        [HttpDelete]
        [Route("api/metric/Delete/{id}")]
        public async Task<HttpResponseMessage> Delete(int id)
        {
            // //delete metric values
            // await MetricValuesService.DeleteMetricValuesBMetricId(id);
            // //delete reason and reason values
            // await ReasonsService.DeleteReasonAndValuesByMetricId(id);
            // //delete ideas

            // //delete metric
            //// await MetricsService.DeleteItemAsync(id);
            await MetricsService.DeleteMetricAndRelatedItemsAsync(id);
            return ToJson(new
            {
                issueId = id
            });
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

        [HttpPost]
        public async Task<HttpResponseMessage> Post(int id)
        {
            await MetricsService.UpdateMetricStatus(id);
            return ToJson(new
            {
                issueId = id
            });
        }
    }
}