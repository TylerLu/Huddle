using Huddle.BotWebApp.Models;
using Huddle.BotWebApp.Services;
using Huddle.BotWebApp.SharePoint;
using Huddle.BotWebApp.Utils;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Connector;
using Microsoft.Bot.Connector.Teams.Models;
using Microsoft.Graph;
using Newtonsoft.Json;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Huddle.BotWebApp.Dialogs
{
    [Serializable]
    public class CreateIdeaDialog2 : TeamDialog<object>
    {
        protected override async Task StartTeamActionAsync(IDialogContext context)
        {
            await context.Forward(new SignInDialog(), SendCreateIdeaCardAsync, context.Activity, CancellationToken.None);
        }

        private async Task SendCreateIdeaCardAsync(IDialogContext context, IAwaitable<GraphServiceClient> result)
        {
            // Get team members
            var graphServiceClient = await result;
            var teamService = new TeamService(graphServiceClient);
            var membersTask = teamService.GetTeamMembersAsync(Team.Id);

            // Get active metrics
            var clientContext = await AuthenticationHelper.GetAppOnlySharePointClientContextAsync();
            var metricsService = new MetricsService(clientContext);
            var metrics = (await metricsService.GetActiveMetricsAsync(Team.Id))
                .Union(new[] { Metric.Other })
                .ToArray();

            // Get create idea card
            var createIdeaCard = GetCreateIdeaCard(metrics, await membersTask);

            // Send card
            var message = context.MakeMessage();
            message.Attachments.Add(createIdeaCard.ToAttachment());
            await context.PostAsync(message);

            context.Done<object>(null);
        }

        private O365ConnectorCard GetCreateIdeaCard(Metric[] metrics, TeamMember[] members)
        {
            var metricChoices = metrics
                .Select(m => new O365ConnectorCardMultichoiceInputChoice(m.Name, JsonConvert.SerializeObject(m)))
                .ToList();

            var memberChoices = members
                .Select(m => new O365ConnectorCardMultichoiceInputChoice(m.DisplayName, $"{{\"id\":\"{m.Id}\", \"displayName\":\"{m.DisplayName}\"}}"))
                .ToList();

            var teamJson = JsonConvert.SerializeObject(Team);
            return new O365ConnectorCard(
                "Create New Idea",
                potentialAction: new O365ConnectorCardActionBase[]
                {
                    new O365ConnectorCardActionCard(O365ConnectorCardActionCard.Type, "Create a new idea", "create-idea",
                        new O365ConnectorCardInputBase[] {
                            new O365ConnectorCardTextInput(O365ConnectorCardTextInput.Type, "title", true, "What is your idea?", null, false, null),
                            new O365ConnectorCardTextInput(O365ConnectorCardTextInput.Type, "next-steps", true, "What are the next steps to implement this idea?", null, true, null),
                            new O365ConnectorCardMultichoiceInput(O365ConnectorCardMultichoiceInput.Type, "metric", true, "What metric does this idea try to move?", null, metricChoices, "compact", false),
                            new O365ConnectorCardMultichoiceInput(O365ConnectorCardMultichoiceInput.Type, "owner", true, "Please identify the idea owner", null, memberChoices, "compact", false),
                            new O365ConnectorCardDateInput(O365ConnectorCardDateInput.Type, "start-date", true, "What date will you start to implement this?", null, false)
                        },
                        new O365ConnectorCardActionBase[]{
                            new O365ConnectorCardHttpPOST(O365ConnectorCardHttpPOST.Type, "Create", "create-idea",
                            @"{""title"":""{{title.value}}"", ""nextSteps"":""{{next-steps.value}}"", ""metric"":{{metric.value}}, ""owner"":{{owner.value}}, ""startDate"":""{{start-date.value}}"", ""team"":" + teamJson + " }")
                        })
                });
        }

    }
}