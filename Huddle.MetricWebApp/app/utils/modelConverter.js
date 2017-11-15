"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dateHelper_1 = require("../utils/dateHelper");
var ModelConverter = (function () {
    function ModelConverter() {
    }
    ModelConverter.ToReasonListBackend = function (reasons) {
        var _this = this;
        return reasons.map(function (reason) { return _this.ToReasonBackend(reason); });
    };
    ModelConverter.ToReasonBackend = function (reason) {
        return {
            Id: reason.id,
            Issue: this.ToIssueBackend(reason.issue),
            Name: reason.name,
            State: reason.reasonState
        };
    };
    ModelConverter.ToIssueBackend = function (issue) {
        return {
            Id: issue.id,
            Name: issue.name,
            Metric: issue.metric,
            State: issue.issueState,
            TargetGoal: issue.targetGoal,
            Category: this.toCategoryBackend(issue.category),
            StartDate: issue.startDate
        };
    };
    ModelConverter.toCategoryBackend = function (category) {
        return {
            Id: category == null ? 0 : category.id,
            Name: category == null ? '' : category.name
        };
    };
    ModelConverter.toIssueMetricBackend = function (issueMetric) {
        return {
            Id: issueMetric.id,
            InputDate: dateHelper_1.DateHelper.LocalToUTC(issueMetric.inputDate),
            MetricValues: issueMetric.metricValues,
            Issue: this.ToIssueBackend(issueMetric.issue)
        };
    };
    ModelConverter.toReasonMetricBackend = function (reasonMetric) {
        return {
            Id: reasonMetric.id,
            InputDate: dateHelper_1.DateHelper.LocalToUTC(reasonMetric.inputDate),
            ReasonMetricValues: reasonMetric.reasonMetricValues,
            Reason: this.ToReasonBackend(reasonMetric.reason)
        };
    };
    return ModelConverter;
}());
exports.ModelConverter = ModelConverter;
//# sourceMappingURL=modelConverter.js.map