using Huddle.MetricWebApp.Infrastructure;
using Huddle.MetricWebApp.Services;
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
    public class TeamsController : BaseAPIController
    {
        // GET: Teams
    
        [HttpGet]
        public async Task<HttpResponseMessage> Get(string id)
        {
            var users = await new TeamsService(await AuthenticationHelper.GetGraphServiceClientAsync()).GetTeamMembersAsync(id);
            var result = users.Select(user => user.ToJson());
            return ToJson(result);
        }
    }
}