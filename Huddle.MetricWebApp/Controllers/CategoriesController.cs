using Huddle.MetricWebApp.SharePoint;
using Huddle.MetricWebApp.Util;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;

namespace Huddle.MetricWebApp.Controllers
{
    public class CategoriesController : BaseAPIController
    {
        public async Task<HttpResponseMessage> Get()
        {
            var categories = await CategoriesService.GetItemsAsync();
            var result = categories.Select(category => category.ToJson());
            return ToJson(result);
        }
    }
}