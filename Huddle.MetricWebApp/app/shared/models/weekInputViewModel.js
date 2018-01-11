"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var issueMetric_1 = require("./issueMetric");
var reasonMetric_1 = require("./reasonMetric");
var WeekInputViewModel = /** @class */ (function () {
    function WeekInputViewModel() {
        this.inputLength = 7;
        this.issueMetricArray = new Array();
        this.reasonMetricArray = new Array();
        for (var i = 0; i < this.inputLength; i++) {
            this.issueMetricArray.push(new issueMetric_1.IssueMetric());
            this.reasonMetricArray.push(new reasonMetric_1.ReasonMetric());
        }
    }
    WeekInputViewModel.prototype.resetIssue = function (issue) {
        this.issueMetricArray.forEach(function (issueMetric) {
            issueMetric.issue = issue;
        });
    };
    return WeekInputViewModel;
}());
exports.WeekInputViewModel = WeekInputViewModel;
//# sourceMappingURL=weekInputViewModel.js.map