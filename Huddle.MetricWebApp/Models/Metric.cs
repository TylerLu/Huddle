using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Huddle.MetricWebApp.Models
{
    public class Metric:IQueryResult
    {
        public int Id { get; set; }

        public Issue Issue {get;set;}

        public string Name { get; set; }

        public string TargetGoal{ get; set; }

        public string ValueType { get; set; }
        public int State { get; set; }
        public DateTime StartDate { get; set; }
    }
}