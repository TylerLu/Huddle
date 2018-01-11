using Huddle.MetricWebApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Huddle.MetricWebApp.Models
{
    public enum TrackingFrequency
    {
        Daily,
        Weekly
    }
    public class Reason:IQueryResult
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public Metric Metric{ get; set; }

        public DateTime StartDate { get; set; }
        public string ReasonTracking { get; set; }
        public TrackingFrequency? TrackingFrequency { get; set; }

        public string ValueType { get; set; }
        public int State { get; set; }
    }
}