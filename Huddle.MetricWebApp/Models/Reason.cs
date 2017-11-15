using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Huddle.MetricWebApp.Models
{
    public class Reason
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public Issue Issue { get; set; }

        public DateTime StartDate { get; set; }
        public int State { get; set; }
    }
}