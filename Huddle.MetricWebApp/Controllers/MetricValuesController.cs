using Huddle.MetricWebApp.Models;
using Huddle.MetricWebApp.SharePoint;
using Huddle.MetricWebApp.Util;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace Huddle.MetricWebApp.Controllers
{
    public class MetricValuesController : BaseAPIController
    {
        [Route("api/metricvalues/{metricIds}/{reasonIds}/{weekStartDay}")]
        public async Task<HttpResponseMessage> Get(string metricIds,string reasonIds,DateTime weekStartDay)
        {
            var metricValues = new List<MetricValue[]>();
            var metricIdList= metricIds.Split(new char[] { '-' }).ToList();
            metricValues = await MetricValuesService.GetItemsAsync(metricIdList, weekStartDay);

            var reasonValues = new List<ReasonValue[]>();
            var reasonIdList= reasonIds.Split(new char[] { '-' }).ToList();
            reasonValues = await ReasonValuesService.GetItemsAsync(reasonIdList, weekStartDay);

            return ToJson(new {
                metricValuesData = metricValues.Select(mv => mv.ToJson()).ToList(),
                reasonValuesData = reasonValues.Select(rv => rv.ToJson()).ToList()
            });
        }

        // POST api/<controller>
        public async Task<HttpResponseMessage> Post(JObject objData)
        {
            //dynamic jsonData = objData;
            //JArray issueMetrics = jsonData.issueMetrics;
            //var toAddIssueMetrics = issueMetrics.Select(im => im.ToObject<MetricValue>()).ToList();

            //JArray reasonMetricArrays = jsonData.reasonMetrics;
            //var toAddReasonMetrics = reasonMetricArrays.Select(rmArray=> {
            //    return rmArray.Select(rm => rm.ToObject<ReasonValue>()).ToList();
            //}).ToList();

            //await IssuesService.UpdateItemAsync(toAddIssueMetrics.First().Metric);

            //toAddIssueMetrics.ForEach(async metricValue =>
            //{
            //    if (metricValue.Value.HasValue)
            //    {
            //        if (metricValue.Id == 0)
            //            await MetricValuesService.InsertItemAsync(metricValue);
            //        else
            //            await MetricValuesService.UpdateItemAsync(metricValue);
            //    }
            //});

            //toAddReasonMetrics.ForEach(async reasonMetricList =>
            //{
            //    await ReasonsService.UpdateItemAsync(reasonMetricList.First().Reason);
            //});


            //toAddReasonMetrics.ForEach(reasonMetricList =>
            //{
            //    reasonMetricList.ForEach(async reasonMetric =>
            //    {
            //        if (reasonMetric.Value.HasValue)
            //        {
            //            if (reasonMetric.Id == 0)
            //                await ReasonValuesService.InsertItemAsync(reasonMetric);
            //            else
            //                await ReasonValuesService.UpdateItemAsync(reasonMetric);
            //        }
            //    });
            //});

            return ToJson(new
            {
                success = true
            });
        }

    }
}