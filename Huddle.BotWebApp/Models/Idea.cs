using System;

namespace Huddle.BotWebApp.Models
{
    [Serializable]
    public class Idea
    {
        public string Id { get; set; }

        public string Bucket { get; set; }

        public string Title { get; set; }

        //public string NextSteps { get; set; }

        //public string AlignedToMetric { get; set; }

        public string Description { get; set; }

        public TeamMember[] Owners { get; set; }

        public DateTimeOffset? StartDate { get; set; }
 
    }
}