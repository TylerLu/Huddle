using Microsoft.Azure.WebJobs;

namespace Huddle.WebJob
{
    class Program
    {
        static void Main(string[] args)
        {
            // Uncomment the following 4 lines to quick debug the WebJob
            // Functions.MoveShareableIdeas(null).Wait();
            // Functions.RemoveObsoleteIdeas(null).Wait();
            // Functions.SyncMetricIdeaList(null).Wait();
            // return;

            JobHostConfiguration config = new JobHostConfiguration();
            config.UseTimers();

            var host = new JobHost(config);
            host.RunAndBlock();
        }
    }
}
