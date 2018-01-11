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
    public class ReasonsController:BaseAPIController
    {
        // GET api/<controller>/5
        [Route("api/reasons/{issueId}/{state}")]
        [HttpGet]
        public async Task<HttpResponseMessage> Get(int issueId, int state)
        {
            var reasonList = await ReasonsService.GetItemsAsync(state,issueId);
            var result = reasonList.Select(reason => reason.ToJson()).ToArray();
            return ToJson(result);
        }

        // POST api/<controller>
        [Route("api/reasons")]
        [HttpPost]
        public async Task<HttpResponseMessage> Post(JObject objData)
        {
            dynamic jsonData = objData;
            JObject reason = jsonData.reason;
            var toAddReason = reason.ToObject<Reason>();
            await ReasonsService.InsertItemAsync(toAddReason);
            return ToJson(new
            {
                reasonId = toAddReason.Id
            });
        }

        // PUT api/<controller>/5
        public void Put(int id, [FromBody]string value)
        {
        }
    }
}