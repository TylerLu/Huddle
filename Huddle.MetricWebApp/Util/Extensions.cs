using Huddle.MetricWebApp.Models;
using Microsoft.Azure.ActiveDirectory.GraphClient;
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

        public static object ToJson(this Microsoft.Graph.User user)
        {
            return new
            {
                id = user.Id,
                name = user.DisplayName,
                mail = user.Mail
            };
        }


        public static object ToJson(this Issue issue)
        {
            return new
            {
                id = issue.Id,
                category = (issue.Category != null ? new { id = issue.Category.Id, name = issue.Category.Name } : new { id = 0, name = string.Empty }),
                metric = issue.Metric,
                name = issue.Name,
                startDate = issue.StartDate,
                issueState = issue.State,
                owner = issue.Owner,
                activeMetricCount = issue.ActiveMetricCount
            };
        }

        public static object ToJson(this Metric metric)
        {
            return new
            {
                id = metric.Id,
                issue = metric.Issue,
                name = metric.Name,
                targetGoal = metric.TargetGoal,
                valueType = metric.ValueType,
                metricState = metric.State,
                startDate = metric.StartDate,
            };
        }

        public static object ToJson(this Reason reason)
        {
            return new
            {
                id = reason.Id,
                name = reason.Name,
                metric = reason.Metric,
                startDate = reason.StartDate,
                reasonState = reason.State,
                reasonTracking = reason.ReasonTracking,
                trackingFrequency = reason.TrackingFrequency,
                valueType = reason.ValueType
            };
        }

        public static object ToJson(this MetricValue[] issueMetrics)
        {
            return new
            {
                isMetricValue = true,
                metricValueArray = issueMetrics.Select(im => new {
                    id = im.Id,
                    metric = im.Metric.ToJson(),
                    metricValues = im.Value,
                    inputDate = im.InputDate
                })
            };
        }

        public static object ToJson(this ReasonValue[] reasonMetrics)
        {
            return new
            {
                isMetricValue = false,
                reasonValueArray = reasonMetrics.Select(im => new {
                    id = im.Id,
                    reason= im.Reason.ToJson(),
                    reasonMetricValues = im.Value,
                    inputDate = im.InputDate
                })
            };
        }

        public static TrackingFrequency? ToTrackingFrequency(this string trackingStr)
        {
            TrackingFrequency result;
            if (Enum.TryParse(trackingStr, out result))
                return result;
            return null;
        }

    }
}