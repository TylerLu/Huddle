using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Huddle.MetricWebApp.Models
{
    public class IssueMetric
    {
        public int Id { get; set; }
        public Issue Issue{ get; set; }
        public int? MetricValues { get; set; }
        public DateTime InputDate { get; set; }
    }
}