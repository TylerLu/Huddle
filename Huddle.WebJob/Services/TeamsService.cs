using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Huddle.WebJob.Models;

namespace Huddle.WebJob.Services
{
    public class TeamsService
    {
        private IEnumerable<Team> joinedTeams = null;
        private Func<Team, bool> isGlobalTeam = t => t.DisplayName.ToUpper().Contains(Constants.GlobalTeam.ToUpper());

        public async Task<IEnumerable<Team>> GetJoinedTeamsAsync()
        {
            if (joinedTeams == null)
            {
                joinedTeams = (await HttpHelper.Request<Array<Team>>(Constants.LogicAppUrls.GetJoinedTeams, null)).Value;
            }
            return joinedTeams;
        }

        public async Task<Team> GetGlobalTeamAsync()
        {
            return (await GetJoinedTeamsAsync()).Where(isGlobalTeam).FirstOrDefault();
        }

        public async Task<IEnumerable<Team>> GetNonGlobalTeamsAsync()
        {
            return (await GetJoinedTeamsAsync()).Where(t => !isGlobalTeam(t)).ToArray();
        }
    }
}
