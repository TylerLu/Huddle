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
            Issue toAddIssue = jsonData.issue.ToObject<Issue>();
            toAddIssue.State = 1;
            toAddIssue.MSTeamId = jsonData.teamId;
            var issueId = await IssuesService.InsertItemAsync(toAddIssue);

            return ToJson(new {
                issueId = issueId
            });
        }

        // PUT api/<controller>/5
        public void Put(int id, [FromBody]string value)
        {
        }

        [HttpPost, Route("api/issues/editIssue")]
        public async Task<HttpResponseMessage> EditIssue(JObject objData)
        {
            dynamic jsonData = objData;
            JObject issue = jsonData.issue;
            var toEditIssue = issue.ToObject<Issue>();
            await IssuesService.UpdateItemAsync(toEditIssue);
            return ToJson(new
            {
                issueId = toEditIssue.Id
            });
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