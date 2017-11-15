using System;

namespace Huddle.BotWebApp.Models
{
    [Serializable]
    public class Metric
    {
        public static readonly Metric Other = new Metric { Name = "Other" };

        public int? Id { get; set; }

        public string Name { get; set; }
    }
}