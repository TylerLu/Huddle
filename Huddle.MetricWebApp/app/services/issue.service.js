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
var IssueService = (function () {
    function IssueService(dataService) {
        this.dataService = dataService;
    }
    IssueService.prototype.filterIssueList = function (state, teamId) {
        var _this = this;
        var activeObject = new Rx_1.ReplaySubject(1);
        this.dataService.getArray(constants_1.Constants.webAPI.issuesFilterUrl + "/" + state + "/" + teamId + '/')
            .subscribe(function (resp) {
            var result = [];
            resp.forEach(function (issue, index) {
                issue.startDate = dateHelper_1.DateHelper.UTCToLocal(issue.startDate);
                result.push(issue);
            }, _this);
            activeObject.next(result);
        }, function (error) { activeObject.error(error); });
        return activeObject;
    };
    IssueService.prototype.getCategories = function () {
        var _this = this;
        var activeObject = new Rx_1.ReplaySubject(1);
        this.dataService.getArray(constants_1.Constants.webAPI.categoriesUrl + '/')
            .subscribe(function (resp) {
            var result = [];
            resp.forEach(function (category, index) {
                result.push(category);
            }, _this);
            activeObject.next(result);
        }, function (error) { activeObject.error(error); });
        return activeObject;
    };
    IssueService.prototype.getIssueById = function (issueId) {
        var activeObject = new Rx_1.ReplaySubject(1);
        this.dataService.getObject(constants_1.Constants.webAPI.issuesUrl + "/" + issueId.toString())
            .subscribe(function (issue) {
            issue.startDate = dateHelper_1.DateHelper.UTCToLocal(issue.startDate);
            issue.isMetricEditable = false;
            issue.isNameEditable = false;
            activeObject.next(issue);
        }, function (error) {
            activeObject.error(error);
        });
        return activeObject;
    };
    IssueService.prototype.addIssue = function (issue, reasons, teamId) {
        var activeObject = new Rx_1.ReplaySubject(1);
        this.dataService.post(constants_1.Constants.webAPI.issuesUrl, { issue: modelConverter_1.ModelConverter.ToIssueBackend(issue), reasons: modelConverter_1.ModelConverter.ToReasonListBackend(reasons), teamId: teamId })
            .subscribe(function (resp) {
            activeObject.next(resp.issueId);
        }, function (error) { return activeObject.error(error); });
        return activeObject;
    };
    return IssueService;
}());
IssueService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [data_service_1.DataService])
], IssueService);
exports.IssueService = IssueService;
//# sourceMappingURL=issue.service.js.map