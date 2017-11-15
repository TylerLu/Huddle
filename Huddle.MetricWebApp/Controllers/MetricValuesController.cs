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
        [Route("api/metricvalues/{issueId}/{reasonIds}/{weekStartDay}")]
        public async Task<HttpResponseMessage> Get(int issueId,string reasonIds,DateTime weekStartDay)
        {
            var issueMetrics = await IssueMetricsService.GetItemsAsync(issueId, weekStartDay);
            if (string.IsNullOrEmpty(reasonIds))
                return ToJson(new { issueMetrics = issueMetrics });

            var reasonMetrics = new List<ReasonMetric[]>();
            var reasonIdList= reasonIds.Split(new char[] { '-' }).ToList();
            reasonMetrics = await ReasonMetricsService.GetItemsAsync(reasonIdList, weekStartDay);
            var result = reasonMetrics.Select(rm => rm.ToJson()).ToList();
            result.Add(issueMetrics.ToJson());
            return ToJson(result);
        }

        // POST api/<controller>
        public async Task<HttpResponseMessage> Post(JObject objData)
        {
            dynamic jsonData = objData;
            JArray issueMetrics = jsonData.issueMetrics;
            var toAddIssueMetrics = issueMetrics.Select(im => im.ToObject<IssueMetric>()).ToList();

            JArray reasonMetricArrays = jsonData.reasonMetrics;
            var toAddReasonMetrics = reasonMetricArrays.Select(rmArray=> {
                return rmArray.Select(rm => rm.ToObject<ReasonMetric>()).ToList();
            }).ToList();

            await IssuesService.UpdateItemAsync(toAddIssueMetrics.First().Issue);

            toAddIssueMetrics.ForEach(async issueMetric =>
            {
                if (issueMetric.MetricValues.HasValue)
                {
                    if (issueMetric.Id == 0)
                        await IssueMetricsService.InsertItemAsync(issueMetric);
                    else
                        await IssueMetricsService.UpdateItemAsync(issueMetric);
                }
            });

            toAddReasonMetrics.ForEach(async reasonMetricList =>
            {
                await ReasonsService.UpdateItemAsync(reasonMetricList.First().Reason);
            });

            
            toAddReasonMetrics.ForEach(reasonMetricList =>
            {
                reasonMetricList.ForEach(async reasonMetric =>
                {
                    if (reasonMetric.ReasonMetricValues.HasValue)
                    {
                        if (reasonMetric.Id == 0)
                            await ReasonMetricsService.InsertItemAsync(reasonMetric);
                        else
                            await ReasonMetricsService.UpdateItemAsync(reasonMetric);
                    }
                });
            });

            return ToJson(new
            {
                success = true
            });
        }

    }
}