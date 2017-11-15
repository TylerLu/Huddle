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
var router_1 = require("@angular/router");
var cookie_service_1 = require("../services/cookie.service");
var issue_service_1 = require("../services/issue.service");
var issue_1 = require("../shared/models/issue");
var issueState_1 = require("../shared/models/issueState");
var issue_viewmodel_1 = require("./issue.viewmodel");
var allowIssueClick_1 = require("../shared/models/allowIssueClick");
var issueState_viewmodel_1 = require("./issueState.viewmodel");
var constants_1 = require("../shared/constants");
var commonUtil_1 = require("../utils/commonUtil");
var addIssue_component_1 = require("../issue/addIssue.component");
var IssueListComponent = (function () {
    function IssueListComponent(issueService, router, activateRoute, cookieService) {
        this.issueService = issueService;
        this.router = router;
        this.activateRoute = activateRoute;
        this.cookieService = cookieService;
        this.displayedIssueArray = new Array();
        this.displayedIssueArrayLength = 6;
        this.issueArray = new Array();
        this.issueStates = new Array();
        this.selectedIssueState = new issueState_viewmodel_1.IssueStateViewModel();
        this.isCreateBtnVisible = true;
        this.teamId = '1';
        this.afterCheckAllowClick = new core_1.EventEmitter();
    }
    IssueListComponent.prototype.ngOnInit = function () {
        if (commonUtil_1.CommonUtil.isInMsTeam()) {
            this.initTeamContext();
        }
        else {
            this.initIssues();
        }
        this.isNewIssueButtonClicked = false;
        this.isRequestCompleted = false;
    };
    IssueListComponent.prototype.initIssues = function () {
        this.initIssueStates();
    };
    IssueListComponent.prototype.isMetricUrl = function () {
        return location.pathname.indexOf(constants_1.Constants.route.metricIssue) >= 0;
    };
    IssueListComponent.prototype.getIssueId = function () {
        var issueIdStr = '';
        if (this.isMetricUrl()) {
            issueIdStr = location.pathname.replace('/' + constants_1.Constants.route.metricIssue + '/', '');
        }
        else {
            issueIdStr = this.cookieService.get("issueId");
        }
        if (issueIdStr != '')
            return parseInt(issueIdStr);
        else
            return 0;
    };
    IssueListComponent.prototype.initSelectedIssue = function () {
        var _this = this;
        if (this.isMetricUrl()) {
            this.issueArray.forEach(function (issue) {
                if (_this.selectedIssue && _this.selectedIssue.Issue && issue.Issue.id == _this.selectedIssue.Issue.id) {
                    issue.IsSelected = true;
                }
            });
            this.resetDisplayIssueArray();
        }
    };
    IssueListComponent.prototype.initTeamContext = function () {
        this.teamId = commonUtil_1.CommonUtil.getTeamId();
        this.initIssues();
    };
    IssueListComponent.prototype.initIssueStates = function () {
        var _this = this;
        var issue1 = new issueState_viewmodel_1.IssueStateViewModel();
        issue1.title = issueState_1.IssueState[issueState_1.IssueState.active];
        issue1.value = issueState_1.IssueState.active;
        this.issueStates.push(issue1);
        var issue2 = new issueState_viewmodel_1.IssueStateViewModel();
        issue2.title = issueState_1.IssueState[issueState_1.IssueState.closed];
        issue2.value = issueState_1.IssueState.closed;
        this.issueStates.push(issue2);
        var issueId = this.getIssueId();
        if (issueId > 0) {
            this.issueService.getIssueById(issueId)
                .subscribe(function (issue) {
                _this.selectedIssue = new issue_viewmodel_1.IssueViewModel();
                _this.selectedIssue.Issue = issue;
                _this.selectedIssueState = issue.issueState == issueState_1.IssueState.active ? issue1 : issue2;
                _this.doFilterIssues(_this.selectedIssueState.value);
            });
        }
        else {
            this.selectedIssueState = issue1;
            this.doFilterIssues(this.selectedIssueState.value);
        }
    };
    IssueListComponent.prototype.clickIssue = function (item) {
        this.displayedIssueArray.forEach(function (item) { return item.IsSelected = false; });
        item.IsSelected = true;
        this.selectedIssue = item;
        this.afterCheckAllowClick.emit(false);
        if (this.allowClick.allowClick)
            this.doNavigateIssue(item);
    };
    IssueListComponent.prototype.doNavigateIssue = function (item) {
        if (item && item.Issue) {
            this.cookieService.put("issueId", item.Issue.id.toString());
            return commonUtil_1.CommonUtil.navigateToUrl('/' + constants_1.Constants.route.metricIssue + '/' + item.Issue.id, this.router);
        }
        else {
            return commonUtil_1.CommonUtil.navigateToUrl('/' + constants_1.Constants.route.addIssue, this.router);
        }
    };
    IssueListComponent.prototype.doNavigate = function () {
        if (!this.isNewIssueButtonClicked)
            this.doNavigateIssue(this.selectedIssue);
        else
            this.doNavigateIssue();
    };
    IssueListComponent.prototype.doFilterIssues = function (state, ifClearSelectedIssue) {
        var _this = this;
        if (ifClearSelectedIssue == true)
            this.selectedIssue = null;
        this.issueService.filterIssueList(state, this.teamId)
            .subscribe(function (resp) {
            _this.issueArray = resp.map(function (issue) {
                var issueModel = new issue_viewmodel_1.IssueViewModel();
                issueModel.Issue = issue;
                issueModel.IsSelected = false;
                return issueModel;
            });
            _this.resetDisplayIssueArray();
            if (ifClearSelectedIssue == null) {
                if (_this.isMetricUrl()) {
                    _this.initSelectedIssue();
                }
            }
            var self = _this;
            if (_this.displayedIssueArray.length > 0) {
                if (_this.selectedIssue && _this.selectedIssue.Issue && _this.selectedIssue.Issue.id) {
                    _this.doNavigateIssue(_this.selectedIssue)
                        .then(function () {
                        self.initSelectedIssue();
                    });
                }
                else {
                    _this.doNavigateIssue(_this.displayedIssueArray[0])
                        .then(function () {
                        self.selectedIssue = self.displayedIssueArray[0];
                        self.initSelectedIssue();
                    });
                }
            }
            else {
                var emptyIssue = new issue_viewmodel_1.IssueViewModel();
                emptyIssue.Issue = new issue_1.Issue();
                emptyIssue.Issue.id = 0;
                _this.doNavigateIssue(emptyIssue);
            }
            _this.isRequestCompleted = true;
        });
    };
    IssueListComponent.prototype.resetDisplayIssueArray = function (scrollUp) {
        var _this = this;
        if (this.issueArray.length == 0)
            this.displayedIssueArray = new Array();
        if (scrollUp == null) {
            if (this.selectedIssue == null || this.displayedIssueArray.length == 0) {
                this.displayedIssueArray = this.issueArray.slice(0, this.displayedIssueArrayLength);
            }
            else {
                var selectedIssueIndex_1 = -1;
                this.issueArray.forEach(function (issue, index) {
                    if (issue.Issue.id == _this.selectedIssue.Issue.id)
                        selectedIssueIndex_1 = index;
                });
                if (selectedIssueIndex_1 > this.displayedIssueArray.length)
                    this.displayedIssueArray = this.issueArray.slice(selectedIssueIndex_1 - this.displayedIssueArrayLength + 1, selectedIssueIndex_1 + 1);
                else
                    this.displayedIssueArray = this.issueArray.slice(selectedIssueIndex_1, selectedIssueIndex_1 + this.displayedIssueArrayLength);
            }
        }
        else {
            var currentIssueIndex_1 = -1;
            this.issueArray.forEach(function (issue, index) {
                if (issue.Issue.id == _this.displayedIssueArray[0].Issue.id)
                    currentIssueIndex_1 = index;
            });
            if (scrollUp == true) {
                if (this.displayedIssueArray[0].Issue.id == this.issueArray[0].Issue.id)
                    return false;
                this.displayedIssueArray = this.issueArray.slice(currentIssueIndex_1 - 1, currentIssueIndex_1 - 1 + this.displayedIssueArrayLength);
            }
            else if (scrollUp == false) {
                if (this.displayedIssueArray[this.displayedIssueArray.length - 1].Issue.id == this.issueArray[this.issueArray.length - 1].Issue.id)
                    return false;
                this.displayedIssueArray = this.issueArray.slice(currentIssueIndex_1 + 1, currentIssueIndex_1 + 1 + this.displayedIssueArrayLength);
            }
        }
        return false;
    };
    IssueListComponent.prototype.filterIssueState = function (state, ifClearSelectedIssue) {
        this.doFilterIssues(state, ifClearSelectedIssue);
    };
    IssueListComponent.prototype.createIssue = function () {
        this.isNewIssueButtonClicked = true;
        this.afterCheckAllowClick.emit(false);
        if (this.allowClick.allowClick) {
            this.addIssue.open();
        }
    };
    IssueListComponent.prototype.issueAdded = function (event) {
        if (event.id <= 0)
            return;
        this.displayedIssueArray.forEach(function (item) { return item.IsSelected = false; });
        var newIssueModel = new issue_viewmodel_1.IssueViewModel();
        newIssueModel.IsSelected = true;
        newIssueModel.IssueState = issueState_1.IssueState.active.toString();
        newIssueModel.Issue = event;
        this.issueArray.push(newIssueModel);
        this.doNavigateIssue(newIssueModel);
        this.resetDisplayIssueArray();
    };
    IssueListComponent.prototype.updateIssue = function (updatedIssue) {
        var findResult = this.displayedIssueArray.filter(function (issue) { return issue.Issue.id == updatedIssue.id; });
        if (findResult.length == 0)
            return;
        findResult[0].Issue.name = updatedIssue.name;
        findResult[0].Issue.metric = updatedIssue.metric;
    };
    return IssueListComponent;
}());
__decorate([
    core_1.Input('allowClick'),
    __metadata("design:type", allowIssueClick_1.AllowIssueClick)
], IssueListComponent.prototype, "allowClick", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], IssueListComponent.prototype, "afterCheckAllowClick", void 0);
__decorate([
    core_1.ViewChild(addIssue_component_1.AddIssueComponent),
    __metadata("design:type", addIssue_component_1.AddIssueComponent)
], IssueListComponent.prototype, "addIssue", void 0);
IssueListComponent = __decorate([
    core_1.Component({
        templateUrl: 'app/issueList/issueList.component.html',
        selector: 'issue-list',
        styleUrls: ['app/issueList/issueList.component.css', 'app/shared/shared.css']
    }),
    __metadata("design:paramtypes", [issue_service_1.IssueService, router_1.Router, router_1.ActivatedRoute, cookie_service_1.CookieService])
], IssueListComponent);
exports.IssueListComponent = IssueListComponent;
//# sourceMappingURL=issueList.component.js.map