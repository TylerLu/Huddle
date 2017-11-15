using Microsoft.Graph;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;

namespace Huddle.BotWebApp
{
    public static class TimeZoneExtensions
    {
        public class TimeZoneResult
        {
            public string Value { get; set; }
        }

        public static async Task<string> GetTimeZoneAsync(this GraphServiceClient client)
        {
            var uri = new Uri(new Uri(Constants.Resources.MSGraph), "/v1.0/me/mailboxSettings/timeZone");
            var request = new HttpRequestMessage(HttpMethod.Get, uri);
            await client.AuthenticationProvider.AuthenticateRequestAsync(request);

            var response = await client.HttpProvider.SendAsync(request);
            var body = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<TimeZoneResult>(body).Value;
        }
    }
}