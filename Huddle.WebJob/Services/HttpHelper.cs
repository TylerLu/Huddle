using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Huddle.WebJob.Services
{
    public static class HttpHelper
    {
        public static async Task<T> Request<T>(string url, JObject parameters)
        {
            var uri = new Uri(url);
            var request = new HttpRequestMessage(HttpMethod.Post, uri);
            if (parameters != null)
            {
                request.Content = new StringContent(parameters.ToString(Formatting.None), Encoding.UTF8, "application/json");
            }
            var response = await new HttpClient().SendAsync(request);
            response.EnsureSuccessStatusCode();
            var body = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<T>(body);
        }
    }
}
