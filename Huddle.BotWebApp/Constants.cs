using System.Configuration;

namespace Huddle.BotWebApp
{
    public class Constants
    {
        public static readonly string AADClientId = ConfigurationManager.AppSettings["ida:ClientId"];
        public static readonly string AADClientSecret = ConfigurationManager.AppSettings["ida:ClientSecret"];
        public static readonly string AADClientCertThumbprint = ConfigurationManager.AppSettings["ida:ClientCertThumbprint"];
        public static readonly string AADTenantId = ConfigurationManager.AppSettings["ida:TenantId"];

        public static readonly string AADInstance = "https://login.microsoftonline.com/";
        public static readonly string Authority = AADInstance + AADTenantId;

        // public const string GraphResourceRootUrl = "https://graph.windows.net";

        public static readonly string LuisAppId = ConfigurationManager.AppSettings["LuisAppId"];
        public static readonly string LuisAPIKey = ConfigurationManager.AppSettings["LuisAPIKey"];
        public static readonly string LuisAPIDomain = ConfigurationManager.AppSettings["LuisAPIDomain"];


        public static readonly string BaseSPSiteUrl = ConfigurationManager.AppSettings["BaseSPSiteUrl"];


        public static class Resources
        {
            public static readonly string AADGraph = "https://graph.windows.net";
            public static readonly string MSGraph = "https://graph.microsoft.com";
        }

        public static class IdeasPlan
        {
            public static readonly string Name = "Idear";

            public static class Buckets
            {
                public static readonly string NewIdea = "New Idea";
                public static readonly string Shareable = "Shareable";
                public static readonly string InProgress = "In Progress";
                public static readonly string Completed = "Completed";
                
                public static readonly string[] All = { NewIdea, InProgress, Completed, Shareable };
            }
        }

        public static class UserDataKey
        {
            public static readonly string TeamId = "TeamId";
        }
    }
}