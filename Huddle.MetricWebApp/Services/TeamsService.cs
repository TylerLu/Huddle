using Microsoft.Graph;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using Huddle.Common;

namespace Huddle.MetricWebApp.Services
{
    public class TeamsService
    {
        private GraphServiceClient graphServiceClient;

        public TeamsService(GraphServiceClient graphServiceClient)
        {
            this.graphServiceClient = graphServiceClient;
        }

        public Task<User[]> GetTeamMembersAsync(string teamId)
        {
            return graphServiceClient.Groups[teamId].Members.Request().GetAllAsync();
        }
    }
}