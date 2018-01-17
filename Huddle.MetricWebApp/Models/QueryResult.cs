using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Huddle.MetricWebApp.Models
{
    public interface IQueryResult{}
    public class QueryData<T> where T:IQueryResult
    {
        public List<T> items;
    }
}