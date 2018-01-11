"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var Rx_1 = require("rxjs/Rx");
var data_service_1 = require("../services/data.service");
var constants_1 = require("../shared/constants");
var modelConverter_1 = require("../utils/modelConverter");
var dateHelper_1 = require("../utils/dateHelper");
var MetricValueService = /** @class */ (function () {
    function MetricValueService(dataService) {
        this.dataService = dataService;
    }
    MetricValueService.prototype.updateMetricValues = function (issueMetrics, reasonMetrics, jsonStr) {
        var activeObject = new Rx_1.ReplaySubject(1);
        var originalData = JSON.parse(jsonStr);
        var originalIssueMetrics = originalData['issueWeekInputviewModel'].issueMetricArray;
        var originalReasonMetrics = originalData['reasonWeekInputViewModelArray'].map(function (reasonWeekVM) { return reasonWeekVM.reasonMetricArray; });
        var toPostIssueMetrics = issueMetrics.filter(function (issueMetric, index) {
            return originalIssueMetrics[index].metricValues != issueMetric.metricValues;
        });
        if (toPostIssueMetrics.length == 0)
            toPostIssueMetrics = [issueMetrics[0]];
        var toPostReasonMetrics = [];
        reasonMetrics.forEach(function (rmArray, index1) {
            var tempRmArray = rmArray.filter(function (reasonMetric, index2) {
                return originalReasonMetrics[index1][index2].reasonMetricValues != reasonMetric.reasonMetricValues;
            });
            if (tempRmArray.length == 0)
                tempRmArray = [rmArray[0]];
            toPostReasonMetrics.push(tempRmArray);
        });
        this.dataService.post(constants_1.Constants.webAPI.metricValuesUrl, { issueMetrics: toPostIssueMetrics.map(function (im) { return modelConverter_1.ModelConverter.toIssueMetricBackend(im); }), reasonMetrics: toPostReasonMetrics.map(function (rmArray) { return rmArray.map(function (rm) { return modelConverter_1.ModelConverter.toReasonMetricBackend(rm); }); }) })
            .subscribe(function (resp) {
            activeObject.next(resp);
        }, function (error) { return activeObject.error(error); });
        return activeObject;
    };
    MetricValueService.prototype.getMetricValues = function (issueId, reasonIds, weekDay) {
        var activeObject = new Rx_1.ReplaySubject(1);
        var splitChar = '-';
        var reasonIdCombineStr = splitChar;
        if (reasonIds.length > 0) {
            reasonIdCombineStr = reasonIds.map(function (a) { return a.toString(); })
                .reduce(function (x, y) { return x + splitChar + y; });
        }
        var weekStartParam = dateHelper_1.DateHelper.getStartDateString(weekDay);
        this.dataService.getArray(constants_1.Constants.webAPI.metricValuesUrl + "/" + issueId + "/" + reasonIdCombineStr + '/' + weekStartParam)
            .subscribe(function (resp) {
            activeObject.next(resp);
        }, function (error) { activeObject.error(error); });
        return activeObject;
    };
    MetricValueService.prototype.getMetricJSON = function (issue, issueReasons, issueWeekInputviewModel, reasonWeekInputViewModelArray) {
        var issueNameEditable = issue.isNameEditable;
        var issueMetricEditable = issue.isMetricEditable;
        issue.isMetricEditable = false;
        issue.isNameEditable = false;
        var reasonIsEditable = [];
        if (issueReasons.length > 0) {
            reasonIsEditable = issueReasons.map(function (reason) { return reason.isEditable; });
            issueReasons.forEach(function (reason) { return reason.isEditable = false; });
        }
        var jsonResult = JSON.stringify({ issue: issue, issueReasons: issueReasons, issueWeekInputviewModel: issueWeekInputviewModel, reasonWeekInputViewModelArray: reasonWeekInputViewModelArray });
        issue.isMetricEditable = issueMetricEditable;
        issue.isNameEditable = issueNameEditable;
        if (issueReasons.length > 0) {
            issueReasons.forEach(function (reason, index) {
                reason.isEditable = reasonIsEditable[index];
            });
        }
        return jsonResult;
    };
    MetricValueService.prototype.cancelMetricAndReasonsEdit = function (jsonStr, issue, issueReasons) {
        var parsedData = JSON.parse(jsonStr);
        var originalIssue = parsedData['issue'];
        var originalReasons = parsedData['issueReasons'];
        issue.name = originalIssue.name;
        issue.metric = originalIssue.metric;
        issue.isMetricEditable = originalIssue.isMetricEditable;
        issue.isNameEditable = originalIssue.isNameEditable;
        issue.issueState = originalIssue.issueState;
        if (issueReasons.length > 0) {
            issueReasons.forEach(function (reason, index) {
                var oldReason = originalReasons[index];
                reason.isEditable = oldReason.isEditable;
                reason.name = oldReason.name;
                reason.reasonState = oldReason.reasonState;
            });
        }
    };
    MetricValueService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [data_service_1.DataService])
    ], MetricValueService);
    return MetricValueService;
}());
exports.MetricValueService = MetricValueService;
//# sourceMappingURL=metricValue.service.js.map