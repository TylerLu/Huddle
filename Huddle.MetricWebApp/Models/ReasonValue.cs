using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Huddle.MetricWebApp.Models
{
    public class ReasonValue
    {
        public int Id { get; set; }
        public Reason Reason { get; set; }
        public double? Value { get; set; }
        public DateTime InputDate { get; set; }
    }
}