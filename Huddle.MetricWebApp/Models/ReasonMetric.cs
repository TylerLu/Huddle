using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Huddle.MetricWebApp.Models
{
    public class ReasonMetric
    {
        public int Id { get; set; }
        public Reason Reason { get; set; }
        public int? ReasonMetricValues { get; set; }
        public DateTime InputDate { get; set; }
    }
}