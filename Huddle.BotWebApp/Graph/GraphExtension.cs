using Microsoft.Graph;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace Huddle.BotWebApp
{
    public static class GraphExtension
    {
        public static async Task<DirectoryObject[]> GetAllAsync(this IGroupMembersCollectionWithReferencesRequest request)
        {
            var collectionPage = await request.GetAsync();
            return await GetAllAsync(collectionPage);
        }

        public static async Task<PlannerTask[]> GetAllAsync(this IPlannerPlanTasksCollectionRequest request)
        {
            var collectionPage = await request.GetAsync();
            return await GetAllAsync(collectionPage);
        }

        public static async Task<PlannerTask[]> GetAllAsync(this IPlannerBucketTasksCollectionRequest request)
        {
            var collectionPage = await request.GetAsync();
            return await GetAllAsync(collectionPage);
        }

        public static async Task<PlannerBucket[]> GetAllAsync(this IPlannerPlanBucketsCollectionRequest request)
        {
            var collectionPage = await request.GetAsync();
            return await GetAllAsync(collectionPage);
        }
                

        private static async Task<TItem[]> GetAllAsync<TItem>(ICollectionPage<TItem> collectionPage)
        {
            var list = new List<TItem>();

            dynamic page = collectionPage;
            while (true)
            {
                list.AddRange(page.CurrentPage);
                if (page.NextPageRequest == null) break;
                page = await page.NextPageRequest.GetAsync();
            }

            return list.ToArray();
        }

        //private static async Task<bool> AnyAsync<TItem>(ICollectionPage<TItem> collectionPage, Func<TItem, bool> predicate)
        //{
        //    dynamic page = collectionPage;
        //    while (true)
        //    {
        //        if (Enumerable.Any(page.CurrentPage, predicate)) return true;
        //        if (page.NextPageRequest == null) return false;
        //        page = await page.NextPageRequest.GetAsync();
        //    }
        //}
    }
}