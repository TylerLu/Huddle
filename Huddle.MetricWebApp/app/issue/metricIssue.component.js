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
var issue_1 = require("../shared/models/issue");
var state_1 = require("../shared/models/state");
var issueState_1 = require("../shared/models/issueState");
var reason_1 = require("../shared/models/reason");
var allowIssueClick_1 = require("../shared/models/allowIssueClick");
var issue_service_1 = require("../services/issue.service");
var reason_service_1 = require("../services/reason.service");
var metricValue_service_1 = require("../services/metricValue.service");
var dateHelper_1 = require("../utils/dateHelper");
var state_viewmodel_1 = require("./state.viewmodel");
var issueList_component_1 = require("../issueList/issueList.component");
var weekSelector_component_1 = require("./weekSelector.component");
var addReason_component_1 = require("./addReason.component");
var MetricIssueComponent = (function () {
    function MetricIssueComponent(route, issueService, reasonService, metricValueService) {
        this.route = route;
        this.issueService = issueService;
        this.reasonService = reasonService;
        this.metricValueService = metricValueService;
        this.allowIssueClick = new allowIssueClick_1.AllowIssueClick(true);
        this.afterXHRRequest = false;
        this.issueMetric = '';
        this.issueName = '';
        this.allowWeekClick = new allowIssueClick_1.AllowIssueClick(true);
        this.isMetricReasonContainerVisible = false;
        this.requestCompleted = false;
        this.currentIssue = new issue_1.Issue();
        this.currentWeekDays = new Array();
        this.metricToggleId = 'toggle-metric';
        this.reasonToggleId = 'toggle-reason';
        this.reasonStates = new Array();
        this.selectedReasonState = new state_viewmodel_1.StateViewModel();
        this.toAddReason = new reason_1.Reason();
        this.issueReasons = new Array();
        this.reasonWeekInputViewModelArray = new Array();
    }
    MetricIssueComponent.prototype.ngOnInit = function () {
        var _this = this;
        var self = this;
        this.route.params.subscribe(function (params) {
            self.requestCompleted = false;
            self.afterXHRRequest = false;
            var issueId = params['id'];
            if (issueId && issueId > 0) {
                _this.issueService.getIssueById(issueId)
                    .subscribe(function (issue) {
                    _this.currentIssue = issue;
                    _this.isMetricReasonContainerVisible = true;
                    _this.filterReason(_this.selectedReasonState.value);
                    _this.issueWeekInputviewModel.resetIssue(_this.currentIssue);
                    _this.resetCurrentIssue();
                }, function (error) { return console.log("onError: " + error); });
            }
            else {
                self.afterXHRRequest = true;
                self.requestCompleted = true;
                self.isMetricReasonContainerVisible = false;
            }
        });
        this.initReasonStates();
    };
    MetricIssueComponent.prototype.rebuildWeekInputViewModel = function () {
        var _this = this;
        this.issueWeekInputviewModel = dateHelper_1.DateHelper.getWeekInputViewModel(true, this.selectWeekDay, this.currentIssue, null);
        if (this.issueReasons.length > 0) {
            this.reasonWeekInputViewModelArray = this.issueReasons.map(function (reason) {
                return dateHelper_1.DateHelper.getWeekInputViewModel(false, _this.selectWeekDay, null, reason);
            });
        }
        if (this.currentIssue && this.currentIssue.id)
            this.getMetricValues();
    };
    MetricIssueComponent.prototype.weekChange = function (event) {
        this.selectWeekDay = event;
        this.currentWeekDays = dateHelper_1.DateHelper.getDaysofWeek(this.selectWeekDay);
        //init weekInputModel get values;
        this.rebuildWeekInputViewModel();
    };
    MetricIssueComponent.prototype.reasonAdded = function (event) {
        if (event.id <= 0)
            return;
        this.filterReason(this.selectedReasonState.value);
    };
    MetricIssueComponent.prototype.initReasonStates = function () {
        var stateActive = new state_viewmodel_1.StateViewModel();
        stateActive.title = state_1.State[state_1.State.active];
        stateActive.value = state_1.State.active;
        this.reasonStates.push(stateActive);
        var stateClosed = new state_viewmodel_1.StateViewModel();
        stateClosed.title = state_1.State[state_1.State.closed];
        stateClosed.value = state_1.State.closed;
        this.reasonStates.push(stateClosed);
        this.selectedReasonState = stateActive;
    };
    MetricIssueComponent.prototype.filterReason = function (state) {
        var _this = this;
        this.reasonService.getReasonsByIssue(this.currentIssue.id, state)
            .subscribe(function (resp) {
            _this.issueReasons = resp;
            _this.reasonWeekInputViewModelArray = _this.issueReasons.map(function (reason) {
                return dateHelper_1.DateHelper.getWeekInputViewModel(false, _this.selectWeekDay, null, reason);
            });
            _this.getMetricValues();
        });
    };
    MetricIssueComponent.prototype.isDateEqual = function (metricDateLocal, metricDateFromBackend) {
        var backendDate = new Date(metricDateFromBackend.toString());
        var localDate = new Date(dateHelper_1.DateHelper.LocalToUTC(metricDateLocal));
        return backendDate.getFullYear() == localDate.getFullYear()
            && backendDate.getMonth() == localDate.getMonth()
            && backendDate.getDate() == localDate.getDate();
    };
    MetricIssueComponent.prototype.getMetricValues = function () {
        var _this = this;
        //clearn metric values first
        this.issueWeekInputviewModel.issueMetricArray.forEach(function (issueMetric) {
            issueMetric.metricValues = null;
            issueMetric.issue = _this.currentIssue;
            issueMetric.id = 0;
        });
        this.reasonWeekInputViewModelArray.forEach(function (reasonWeekVM) { return reasonWeekVM.reasonMetricArray.forEach(function (reasonMetric) {
            reasonMetric.reasonMetricValues = null;
            reasonMetric.id = 0;
        }); });
        this.metricValueService.getMetricValues(this.currentIssue.id, this.issueReasons.map(function (reason) { return reason.id; }), this.selectWeekDay)
            .subscribe(function (resp) {
            var self = _this;
            //refill metric values with xhr result
            resp.forEach(function (weekInputWM) {
                if (weekInputWM.isIssueMetric) {
                    _this.issueWeekInputviewModel.issueMetricArray.forEach(function (issueMetric, index) {
                        var backendIssueMetric = weekInputWM.issueMetricArray.find(function (im) { return self.isDateEqual(issueMetric.inputDate, im.inputDate); });
                        if (backendIssueMetric) {
                            issueMetric.metricValues = backendIssueMetric.metricValues;
                            issueMetric.id = backendIssueMetric.id;
                            issueMetric.inputDate = dateHelper_1.DateHelper.UTCToLocal(issueMetric.inputDate);
                        }
                    });
                }
                else {
                    if (weekInputWM.reasonMetricArray.length > 0) {
                        var targetReasonWeekInputVM = _this.reasonWeekInputViewModelArray.find(function (reasonWeekInputVm) { return reasonWeekInputVm.reasonMetricArray[0].reason.id == weekInputWM.reasonMetricArray[0].reason.id; });
                        if (targetReasonWeekInputVM) {
                            targetReasonWeekInputVM.reasonMetricArray.forEach(function (reasonMetric, index) {
                                var backendReasonMetric = weekInputWM.reasonMetricArray.find(function (rm) { return self.isDateEqual(reasonMetric.inputDate, rm.inputDate); });
                                if (backendReasonMetric) {
                                    reasonMetric.reasonMetricValues = backendReasonMetric.reasonMetricValues;
                                    reasonMetric.id = backendReasonMetric.id;
                                    reasonMetric.inputDate = dateHelper_1.DateHelper.UTCToLocal(reasonMetric.inputDate);
                                }
                            });
                        }
                    }
                }
            });
            _this.currentMetricValues = _this.recalcMetricValues();
            _this.afterXHRRequest = true;
            _this.requestCompleted = true;
        });
    };
    MetricIssueComponent.prototype.createReason = function () {
        this.toAddReason.name = '';
        this.addReason.openDialog();
    };
    MetricIssueComponent.prototype.recalcMetricValues = function () {
        return this.metricValueService.getMetricJSON(this.currentIssue, this.issueReasons, this.issueWeekInputviewModel, this.reasonWeekInputViewModelArray);
    };
    MetricIssueComponent.prototype.resetCurrentIssue = function () {
        this.issueMetric = this.currentIssue.metric;
        this.issueName = this.currentIssue.name;
    };
    MetricIssueComponent.prototype.isCurrentIssueChanged = function () {
        if (!this.currentIssue.id)
            return false;
        if ((this.currentIssue.metric != this.issueMetric && this.currentIssue.isMetricEditable) || (this.currentIssue.name != this.issueName && this.currentIssue.isNameEditable))
            return true;
        return false;
    };
    MetricIssueComponent.prototype.checkIfInputData = function () {
        if (this.isMetricReasonContainerVisible == false)
            return true;
        if (this.afterXHRRequest == true && (!(this.currentMetricValues == this.recalcMetricValues())))
            return false;
        return true;
    };
    MetricIssueComponent.prototype.checkAllowClick = function (event) {
        if (!this.checkIfInputData()) {
            this.allowIssueClick.allowClick = false;
            this.popupConfirmOrOkBox('issueList');
        }
        else {
            this.allowIssueClick.allowClick = true;
        }
        return false;
    };
    MetricIssueComponent.prototype.checkAllowWeekClick = function (event) {
        if (!this.checkIfInputData()) {
            this.allowWeekClick.allowClick = false;
            this.popupConfirmOrOkBox('weekSelector');
        }
        else {
            this.allowWeekClick.allowClick = true;
        }
        return false;
    };
    MetricIssueComponent.prototype.checkData = function () {
        var _this = this;
        var checkResult = true;
        this.issueWeekInputviewModel.issueMetricArray.forEach(function (issueMetric) {
            if (_this.checkAndResetNaN(issueMetric))
                checkResult = false;
        });
        this.reasonWeekInputViewModelArray.forEach(function (reasonWeekInputViewModel) {
            reasonWeekInputViewModel.reasonMetricArray.forEach(function (reasonMetric) {
                if (_this.checkAndResetNaN(reasonMetric))
                    checkResult = false;
            });
        });
        return checkResult;
    };
    MetricIssueComponent.prototype.checkAndResetNaN = function (metric) {
        if (metric.constructor.name == 'IssueMetric') {
            var issueMetric = metric;
            return isNaN(issueMetric.metricValues);
        }
        else {
            var reasonMetric = metric;
            return isNaN(reasonMetric.reasonMetricValues);
        }
    };
    MetricIssueComponent.prototype.confirmSave = function () {
        this.popupConfirmOrOkBox('default');
    };
    MetricIssueComponent.prototype.afterClickInvalid = function (event) {
        return false;
    };
    MetricIssueComponent.prototype.reloadIfMetricStateChange = function () {
        var originalIssue = JSON.parse(this.currentMetricValues)['issue'];
        if (originalIssue.issueState != this.currentIssue.issueState) {
            window.location.reload();
        }
    };
    MetricIssueComponent.prototype.afterClickConfirmOrCancel = function (event) {
        var _this = this;
        if (event) {
            if (!this.checkData()) {
                this.popupConfirmOrOkBox();
            }
            else {
                this.requestCompleted = false;
                this.resetIssueAndReasonEditable();
                this.saveData()
                    .subscribe(function (resp) {
                    _this.toAddReason.name = '';
                    _this.requestCompleted = true;
                    _this.filterReason(_this.selectedReasonState.value);
                    _this.issueList.updateIssue(_this.currentIssue);
                    _this.reloadIfMetricStateChange();
                });
            }
        }
        return false;
    };
    MetricIssueComponent.prototype.afterClickConfirmOrCancelFromIssueList = function (event) {
        var _this = this;
        if (event) {
            if (!this.checkData()) {
                this.popupConfirmOrOkBox();
            }
            else {
                this.requestCompleted = false;
                this.resetIssueAndReasonEditable();
                this.saveData()
                    .subscribe(function (resp) {
                    _this.toAddReason.name = '';
                    _this.issueList.updateIssue(_this.currentIssue);
                    _this.issueList.doNavigate();
                    _this.requestCompleted = true;
                });
            }
        }
        else {
            this.issueList.doNavigate();
        }
        return false;
    };
    MetricIssueComponent.prototype.afterClickConfirmOrCancelFromWeekSelector = function (event) {
        var _this = this;
        if (event) {
            if (!this.checkData()) {
                this.popupConfirmOrOkBox();
            }
            else {
                this.requestCompleted = false;
                this.resetIssueAndReasonEditable();
                this.saveData()
                    .subscribe(function (resp) {
                    _this.toAddReason.name = '';
                    _this.issueList.updateIssue(_this.currentIssue);
                    _this.weekSelector.changeWeek();
                    _this.requestCompleted = true;
                    _this.reloadIfMetricStateChange();
                });
            }
        }
        else {
            this.weekSelector.changeWeek();
            this.metricValueService.cancelMetricAndReasonsEdit(this.currentMetricValues, this.currentIssue, this.issueReasons);
        }
        return false;
    };
    MetricIssueComponent.prototype.resetIssueAndReasonEditable = function () {
        this.currentIssue.isMetricEditable = false;
        this.currentIssue.isNameEditable = false;
        this.issueReasons.forEach(function (reason) { return reason.isEditable = false; });
    };
    MetricIssueComponent.prototype.updateIssueAndReasonState = function () {
        var self = this;
        this.currentIssue.issueState = (function () {
            return jQuery('#' + self.metricToggleId).next('label').hasClass('is-selected') ? issueState_1.IssueState.active : issueState_1.IssueState.closed;
        })();
        this.issueReasons.forEach(function (reason) {
            reason.reasonState = (function () {
                return jQuery('#' + self.reasonToggleId + '-' + reason.id).next('label').hasClass('is-selected') ? state_1.State.active : state_1.State.closed;
            })();
        });
    };
    MetricIssueComponent.prototype.clickSave = function () {
        if (this.checkData()) {
            this.afterClickConfirmOrCancel(true);
        }
        else {
            this.popupConfirmOrOkBox();
        }
    };
    MetricIssueComponent.prototype.saveData = function () {
        this.updateIssueAndReasonState();
        return this.metricValueService.updateMetricValues(this.issueWeekInputviewModel.issueMetricArray, this.reasonWeekInputViewModelArray.map(function (reasonWeekVM) { return reasonWeekVM.reasonMetricArray; }), this.currentMetricValues);
    };
    MetricIssueComponent.prototype.popupConfirmOrOkBox = function (id) {
        if (id == undefined || id == null || id == '')
            new fabric['Dialog'](jQuery('.invalid-input-dialog.no-confirm').find('.ms-Dialog').get(0)).open();
        else
            new fabric['Dialog'](jQuery('#' + id + '.invalid-input-dialog.confirm').find('.ms-Dialog').get(0)).open();
    };
    MetricIssueComponent.prototype.editIssueMetric = function (isEdit) {
        this.currentIssue.isMetricEditable = isEdit;
    };
    MetricIssueComponent.prototype.editIssueName = function (isEdit) {
        this.currentIssue.isNameEditable = isEdit;
    };
    MetricIssueComponent.prototype.editReason = function (reason, isEdit) {
        reason.isEditable = isEdit;
    };
    MetricIssueComponent.prototype.toggleMetric = function () {
        var self = this;
        setTimeout(function () {
            self.updateIssueAndReasonState();
            var reasonState = (self.currentIssue.issueState == issueState_1.IssueState.active) ? state_1.State.active : state_1.State.closed;
            self.issueReasons.forEach(function (reason) {
                reason.reasonState = reasonState;
            });
        }, 50);
    };
    MetricIssueComponent.prototype.toggleReason = function () {
        var self = this;
        setTimeout(function () {
            self.updateIssueAndReasonState();
        }, 50);
    };
    return MetricIssueComponent;
}());
__decorate([
    core_1.ViewChild(issueList_component_1.IssueListComponent),
    __metadata("design:type", issueList_component_1.IssueListComponent)
], MetricIssueComponent.prototype, "issueList", void 0);
__decorate([
    core_1.ViewChild(weekSelector_component_1.WeekSelectorComponent),
    __metadata("design:type", weekSelector_component_1.WeekSelectorComponent)
], MetricIssueComponent.prototype, "weekSelector", void 0);
__decorate([
    core_1.ViewChild(addReason_component_1.AddReasonComponent),
    __metadata("design:type", addReason_component_1.AddReasonComponent)
], MetricIssueComponent.prototype, "addReason", void 0);
MetricIssueComponent = __decorate([
    core_1.Component({
        templateUrl: 'app/issue/metricIssue.component.html',
        selector: 'metric-issue',
        styleUrls: ['app/issueList/issueList.component.css', 'app/issue/metricIssue.component.css', 'app/shared/shared.css']
    }),
    __metadata("design:paramtypes", [router_1.ActivatedRoute,
        issue_service_1.IssueService,
        reason_service_1.ReasonService,
        metricValue_service_1.MetricValueService])
], MetricIssueComponent);
exports.MetricIssueComponent = MetricIssueComponent;
//# sourceMappingURL=metricIssue.component.js.map