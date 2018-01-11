using Huddle.Common;
using Huddle.MetricWebApp.Models;
using Huddle.MetricWebApp.Util;
using Microsoft.SharePoint.Client;

namespace Huddle.MetricWebApp.SharePoint
{
    public static class ClientContextExtensions
    {
        public static ListItemCollection GetItems(this ClientContext clientContext,string listTitle, CamlQuery query)
        {
            var web = clientContext.Site.RootWeb;

            var list = web.Lists.GetByTitle(listTitle);

            var items = list.GetItems(query);
            clientContext.Load(items);
            clientContext.ExecuteQuery();
            return items;
        }


        public static bool IgnoreCaseEquals(this string s, string other)
        {
            return System.StringComparer.InvariantCultureIgnoreCase.Equals(s, other);
        }

        public static System.DateTime UTCToLocalDateTime(this System.DateTime UTCTime, int timeZoneBias)
        {
            var time = UTCTime;
            if (UTCTime.Kind == System.DateTimeKind.Utc)
                time = new System.DateTime(UTCTime.Ticks);
            return time.AddMinutes(-1 * timeZoneBias);
        }

        public static string GetFieldValueStr(this ListItem item, string fieldName)
        {
            if (item[fieldName] == null)
                return string.Empty;
            return item[fieldName].ToString();
        }

        public static int GetFieldValueInt(this ListItem item, string fieldName)
        {
            if (item[fieldName] == null)
                return 0;
            return System.Convert.ToInt32(item[fieldName]);
        }

        public static FieldLookupValue GetFieldValueLookup(this ListItem item, string fieldName)
        {
            var result = new FieldLookupValue();
            if (item[fieldName] == null)
                result = new FieldLookupValue() { LookupId = 0 };
            else
                result = item[fieldName] as FieldLookupValue;
            return result;
        }

        public static string GetFieldValueUser(this ListItem item, string fieldName)
        {
            var result = string.Empty;
            if (item[fieldName] == null)
                return result;
            var userVal = item[fieldName] as FieldUserValue;
            if (userVal == null)
                return result;
            if (string.IsNullOrEmpty(userVal.LookupValue))
                return userVal.Email ?? result;
            return userVal.LookupValue;
        }

        public static Category ToCategory(this ListItem item)
        {
            return new Category()
            {
                Id = item.GetFieldValueInt(SPLists.Categories.Columns.ID),
                Name = item.GetFieldValueStr(SPLists.Categories.Columns.Title),
            };
        }

        public static Issue ToIssue(this ListItem item)
        {
            var category = item.GetFieldValueLookup(SPLists.Issues.Columns.Category);
            return new Issue()
            {
                Id = item.GetFieldValueInt(SPLists.Issues.Columns.ID),
                Category = new Category() { Id = category.LookupId, Name = category.LookupValue },
                Name = item.GetFieldValueStr(SPLists.Issues.Columns.Title),
                StartDate = (System.DateTime)item[SPLists.Issues.Columns.Created],
                State = int.Parse(item[SPLists.Issues.Columns.State].ToString()),
                Owner = item.GetFieldValueUser(SPLists.Issues.Columns.Owner)
            };
        }

        public static Metric ToMetric(this ListItem item)
        {
            var metric = item.GetFieldValueLookup(SPLists.Metrics.Columns.Issue);
            return new Metric()
            {
                Id = item.GetFieldValueInt(SPLists.Metrics.Columns.ID),
                Issue = new Issue() { Id = metric.LookupId, Name = metric.LookupValue },
                Name = item.GetFieldValueStr(SPLists.Metrics.Columns.Title),
                TargetGoal = item.GetFieldValueStr(SPLists.Metrics.Columns.TargetGoal),
                ValueType = item.GetFieldValueStr(SPLists.Metrics.Columns.ValueType),
                State = int.Parse(item[SPLists.Metrics.Columns.State].ToString()),
                StartDate = (System.DateTime)item[SPLists.Metrics.Columns.Created]
            };
        }

        public static Reason ToReason(this ListItem item)
        {
            var metric = item.GetFieldValueLookup(SPLists.Reasons.Columns.Metric);
            return new Reason()
            {
                Id = item.GetFieldValueInt(SPLists.Reasons.Columns.ID),
                Metric = new Metric() { Id = metric.LookupId, Name = metric.LookupValue },
                Name = item.GetFieldValueStr(SPLists.Reasons.Columns.Title),
                StartDate = (System.DateTime)item[SPLists.Reasons.Columns.Created],
                State = int.Parse(item[SPLists.Reasons.Columns.State].ToString()),
                ValueType = item.GetFieldValueStr(SPLists.Reasons.Columns.ValueType),
                ReasonTracking = item.GetFieldValueStr(SPLists.Reasons.Columns.ReasonTracking),
                TrackingFrequency = item.GetFieldValueStr(SPLists.Reasons.Columns.TrackingFrequency).ToTrackingFrequency()
            };
        }

        public static IssueMetric ToIssueMetric(this ListItem item)
        {
            var issue = item[SPLists.IssueMetrics.Columns.Issue] as FieldLookupValue;
            return new IssueMetric()
            {
                Id = (int)item[SPLists.IssueMetrics.Columns.ID],
                Issue = new Issue() { Id = issue.LookupId, Name = issue.LookupValue },
                InputDate = (System.DateTime)item[SPLists.IssueMetrics.Columns.InputDate],
                MetricValues = item.ToMetricValues(SPLists.IssueMetrics.Columns.MetricValue)

            };
        }

        public static ReasonMetric ToReasonMetric(this ListItem item)
        {
            var reason = item[SPLists.ReasonMetrics.Columns.Reason] as FieldLookupValue;
            return new ReasonMetric()
            {
                Id = (int)item[SPLists.ReasonMetrics.Columns.ID],
                Reason = new Reason() { Id = reason.LookupId, Name = reason.LookupValue },
                InputDate = (System.DateTime)item[SPLists.ReasonMetrics.Columns.InputDate],
                ReasonMetricValues = item.ToMetricValues(SPLists.ReasonMetrics.Columns.ReasonMetricValue)
            };
        }

        private static int ToMetricValues(this ListItem item, string metricField)
        {
            double metricValue = (double)item[metricField];
            return System.Convert.ToInt32(metricValue);
        }

    }

    public static class SharePointHelper
    {
        public const string LookupConnectStr = ";#";
        public static string BuildSingleLookFieldValue(int id, string value)
        {
            return id + LookupConnectStr + value;
        }

        public const string ISO8601DateTimeFormat = "yyyy-MM-ddTHH:mm:ssZ";

        public static string ToISO8601DateTimeString(this System.DateTimeOffset dateTimeOffset)
        {
            return dateTimeOffset.ToUniversalTime().ToString(ISO8601DateTimeFormat);
        }

        public static string ToISO8601DateTimeString(this System.DateTime dateTime)
        {
            return dateTime.ToUniversalTime().ToString(ISO8601DateTimeFormat);
        }

    }
}