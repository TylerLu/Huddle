using Huddle.BotWebApp.Models;
using Microsoft.Graph;
using Newtonsoft.Json;
using System;
using System.Net.Http;
using System.Threading.Tasks;

namespace Huddle.BotWebApp
{
    public class Array<T>
    {
        public T[] Value { get; set; }
    }

    public static class TeamsExtension
    {
        public static async Task<Team[]> GetJoinedTeamsAsync(this GraphServiceClient client)
        {
            var uri = new Uri(new Uri(Constants.Resources.MSGraph), "/beta/me/joinedTeams");
            var request = new HttpRequestMessage(HttpMethod.Get, uri);
            await client.AuthenticationProvider.AuthenticateRequestAsync(request);
            
            var response =  await client.HttpProvider.SendAsync(request);
            var body = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<Array<Team>>(body).Value;            
        }
    }
}