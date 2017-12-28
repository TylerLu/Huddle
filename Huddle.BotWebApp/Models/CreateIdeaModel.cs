using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Huddle.BotWebApp.Models
{
    public class CreateIdeaModel
    {
        public string Title { get; set; }

        public string NextSteps { get; set; }

        public Metric Metric { get; set; }

        public TeamMember Owner { get; set; }

        public DateTime StartDate { get; set; }

        public Team Team { get; set; }
    }
}