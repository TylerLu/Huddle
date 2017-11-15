using Huddle.MetricWebApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Huddle.MetricWebApp.Util
{
    public static class Extensions
    {

        public static object ToJson(this Category category)
        {
            return new
            {
                id = category.Id,
                name = category.Name
            };
        }

        public static object ToJson(this Issue issue)
        {
            return new
            {
                id = issue.Id,
                category = issue.Category.Name,
                metric = issue.Metric,
                name = issue.Name,
                startDate = issue.StartDate,
                issueState = issue.State,
                targetGoal = issue.TargetGoal
            };
        }

        public static object ToJson(this Reason reason)
        {
            return new
            {
                id = reason.Id,
                name = reason.Name,
                issue = reason.Issue,
                startDate = reason.StartDate,
                reasonState = reason.State,
            };
        }

        public static object ToJson(this IssueMetric[] issueMetrics)
        {
            return new
            {
                isIssueMetric = true,
                issueMetricArray = issueMetrics.Select(im => new {
                    id = im.Id,
                    issue = im.Issue,
                    metricValues = im.MetricValues,
                    inputDate = im.InputDate
                })
            };
        }

        public static object ToJson(this ReasonMetric[] reasonMetrics)
        {
            return new
            {
                isIssueMetric = false,
                reasonMetricArray = reasonMetrics.Select(im => new {
                    id = im.Id,
                    reason= im.Reason.ToJson(),
                    reasonMetricValues = im.ReasonMetricValues,
                    inputDate = im.InputDate
                })
            };
        }

    }
}