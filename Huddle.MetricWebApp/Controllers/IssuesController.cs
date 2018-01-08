using Huddle.MetricWebApp.Models;
using Huddle.MetricWebApp.SharePoint;
using Huddle.MetricWebApp.Util;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace Huddle.MetricWebApp.Controllers
{
    public class IssuesController : BaseAPIController
    {
        // GET api/<controller>/5
        public async Task<HttpResponseMessage> Get(int id)
        {
            var queryIssue= await IssuesService.GetItemAsync(id);
            return ToJson(queryIssue.ToJson());
        }

        // POST api/<controller>
        public async Task<HttpResponseMessage> Post(JObject objData)
        {
            dynamic jsonData = objData;
            List<Reason> postReasons = new List<Reason>();
            JArray reasonsJsonArray = jsonData.reasons;
            JObject metricJson = jsonData.metric;
            Metric toAddMetric = metricJson.ToObject<Metric>();
            toAddMetric.State = 1;
            foreach (var item in reasonsJsonArray)
            {
                var reason = item.ToObject<Reason>();
                reason.State = 1;
                if (!string.IsNullOrEmpty(reason.Name))
                    postReasons.Add(reason);
            }
            //await IssuesService.InsertItemAsync(toAddMetric);
            //foreach (var reason in postReasons)
            //{
            //    reason.Metric= toAddMetric;
            //    await ReasonsService.InsertItemAsync(reason);
            //}
            return ToJson(new {
                metricId = toAddMetric.Id
            });
        }

        // PUT api/<controller>/5
        public void Put(int id, [FromBody]string value)
        {
        }


    }


    public class IssuesFilterController : BaseAPIController
    {
        [Route("api/issuesfilter/{state}/{teamId}")]
        public async Task<HttpResponseMessage> Get(int state,string teamId)
        {
            var issueList = await IssuesService.GetItemsAsync(state, teamId);
            var result = issueList.Select(issue => issue.ToJson()).ToArray();
            return ToJson(result);
        }
    }
}