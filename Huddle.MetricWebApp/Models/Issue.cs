using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Huddle.MetricWebApp.Models
{
    public class Issue:IQueryResult
    {
        public int Id { get; set; }
        public string Name{ get; set; }
        public Category Category{ get; set; }

        public int Metric { get; set; }

        public int State { get; set; }

        public DateTime StartDate { get; set; }

        public string MSTeamId { get; set; }

        public string Owner { get; set; }

        public int ActiveMetricCount { get; set; }
    }
}