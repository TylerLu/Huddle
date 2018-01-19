using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Huddle.MetricWebApp.Models
{
    public class MetricValue
    {
        public int Id { get; set; }
        public Metric Metric{ get; set; }
        public double? Value { get; set; }
        public DateTime InputDate { get; set; }
    }
}