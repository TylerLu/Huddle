using Huddle.MetricWebApp.Models;
using Huddle.MetricWebApp.SharePoint;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using Huddle.MetricWebApp.Util;

namespace Huddle.MetricWebApp.Controllers
{
    public class QueryController:BaseAPIController
    {
        [Route("api/itemsquery/{state}/{key}/{teamId}")]
        public async Task<HttpResponseMessage> Get(int state,string teamId,string key)
        {
            var resultList = await QueryService.QueryItemsAsync(state, teamId, key);
            var dataResult = resultList.Select(item =>
            {
                var type = item.GetType().Name;
                if (type == "Issue")
                {
                    return (item as Issue).ToJson();

                }
                else if (type == "Metric")
                {
                    return (item as Metric).ToJson();
                }
                else
                {
                    return (item as Reason).ToJson();
                }
            }).ToArray();

            return ToJson(dataResult);
        }
    }
}