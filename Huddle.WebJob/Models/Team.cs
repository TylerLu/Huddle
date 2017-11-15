using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Huddle.WebJob.Models
{
    [Serializable]
    public class Team
    {
        public string Id { get; set; }

        public string DisplayName { get; set; }
    }
}