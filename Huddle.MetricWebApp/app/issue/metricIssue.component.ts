import { Component, OnInit, AfterViewChecked,ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, ReplaySubject } from 'rxjs/Rx';
import { Issue } from '../shared/models/issue';
import { State } from '../shared/models/state';
import { IssueState } from '../shared/models/issueState';
import { Category } from '../shared/models/category';
import { Reason } from '../shared/models/reason';
import { MetricValue} from '../shared/models/MetricValue';
import { ReasonMetric } from '../shared/models/ReasonMetric';
import { AllowIssueClick } from '../shared/models/allowIssueClick';
import { WeekDay } from '../shared/models/weekDay';
import { WeekInputViewModel } from '../shared/models/weekInputViewModel';
import { IssueService } from '../services/issue.service';
import { ReasonService } from '../services/reason.service';
import { MetricValueService } from '../services/metricValue.service';
import { DateHelper } from '../utils/dateHelper';
import { StateViewModel } from './state.viewmodel';
import { IssueListComponent } from '../issueList/issueList.component';
import { WeekSelectorComponent } from './weekSelector.component';
import { AddReasonComponent } from './addReason.component';
import { CommonUtil } from "../utils/commonUtil";
declare var jQuery: any;
declare var fabric: any;
@Component({
    templateUrl: 'app/issue/metricIssue.component.html',
    selector: 'metric-issue',
    styleUrls: [ 'app/issueList/issueList.component.css','app/issue/metricIssue.component.css','app/shared/shared.css']
})

export class MetricIssueComponent implements OnInit {


    allowIssueClick: AllowIssueClick = new AllowIssueClick(true);
    currentMetricValues: string;
    afterXHRRequest: boolean = false;
    metricValue: string = '';
    issueName: string = '';

    allowWeekClick: AllowIssueClick = new AllowIssueClick(true);

    isMetricReasonContainerVisible = false;
    requestCompleted = false;

    currentIssue: Issue = new Issue();
    selectWeekDay: WeekDay;
    currentWeekDays = new Array<Date>();
    

    issueWeekInputviewModel: WeekInputViewModel;

    metricToggleId = 'toggle-metric';
    reasonToggleId = 'toggle-reason';

    reasonStates = new Array<StateViewModel>();
    selectedReasonState = new StateViewModel();

    toAddReason = new Reason();

    issueReasons = new Array<Reason>();
    reasonWeekInputViewModelArray = new Array<WeekInputViewModel>();

    @ViewChild(IssueListComponent)
    private issueList: IssueListComponent;

    @ViewChild(WeekSelectorComponent)
    private weekSelector: WeekSelectorComponent;

    @ViewChild(AddReasonComponent)
    private addReason: AddReasonComponent;

    constructor(private route: ActivatedRoute,
                private issueService: IssueService,
                private reasonService: ReasonService,
                private metricValueService:MetricValueService) {
    }

    ngOnInit(): void {
        let self = this;
        this.route.params.subscribe(params => {
            self.requestCompleted = false;
            self.afterXHRRequest = false;
            let issueId = params['id'];
            if (issueId && issueId > 0) {
                this.issueService.getIssueById(issueId)
                    .subscribe(
                    issue => {
                        this.currentIssue = issue;
                        this.isMetricReasonContainerVisible = true;
                        this.filterReason(this.selectedReasonState.value);
                        this.issueWeekInputviewModel.resetIssue(this.currentIssue);
                        this.resetCurrentIssue();
                    },
                    error => console.log(`onError: ${error}`),
                );
            } else {
                self.afterXHRRequest = true;
                self.requestCompleted = true;
                self.isMetricReasonContainerVisible = false;
            }
        });
        this.initReasonStates();
    }

    rebuildWeekInputViewModel() {
        this.issueWeekInputviewModel = DateHelper.getWeekInputViewModel(true, this.selectWeekDay, this.currentIssue, null);
        if (this.issueReasons.length > 0) {
            this.reasonWeekInputViewModelArray = this.issueReasons.map(reason => {
                return DateHelper.getWeekInputViewModel(false, this.selectWeekDay, null, reason);
            });
        }
        if (this.currentIssue && this.currentIssue.id)
            this.getMetricValues();
    }

    weekChange(event: WeekDay) {
        this.selectWeekDay = event;
        this.currentWeekDays = DateHelper.getDaysofWeek(this.selectWeekDay);

        //init weekInputModel get values;
        this.rebuildWeekInputViewModel();
    }

    reasonAdded(event: Reason) {
        if (event.id <= 0)
            return;
        this.filterReason(this.selectedReasonState.value);
    }

    initReasonStates() {
        let stateActive = new StateViewModel();
        stateActive.title = State[State.active];
        stateActive.value = State.active;
        this.reasonStates.push(stateActive);

        let stateClosed = new StateViewModel();
        stateClosed.title = State[State.closed];
        stateClosed.value = State.closed;
        this.reasonStates.push(stateClosed);

        this.selectedReasonState = stateActive;
    }



    filterReason(state: number) {
        this.reasonService.getReasonsByMetric(this.currentIssue.id)
            .subscribe(resp => {
                this.issueReasons = resp;
                this.reasonWeekInputViewModelArray = this.issueReasons.map(reason => {
                    return DateHelper.getWeekInputViewModel(false, this.selectWeekDay,null, reason);
                });
                this.getMetricValues();
            });
    }

    isDateEqual(metricDateLocal: Date, metricDateFromBackend: Date): boolean{
        let backendDate = new Date(metricDateFromBackend.toString());
        let localDate = new Date(DateHelper.LocalToUTC(metricDateLocal));
        return backendDate.getFullYear() == localDate.getFullYear()
            && backendDate.getMonth() == localDate.getMonth()
            && backendDate.getDate() == localDate.getDate();
    }

    getMetricValues() {
        //clearn metric values first
        this.issueWeekInputviewModel.metricValueArray.forEach(metricValue => {
            metricValue.metricValues = null;
            //changed to metric
            //metricValue.issue = this.currentIssue;
            metricValue.id = 0;
        });
        this.reasonWeekInputViewModelArray.forEach(reasonWeekVM => reasonWeekVM.reasonValueArray.forEach(reasonMetric => {
            reasonMetric.reasonMetricValues = null;
            reasonMetric.id = 0;
        }));
        this.metricValueService.getMetricValues(this.currentIssue.id, this.issueReasons.map(reason => reason.id), this.selectWeekDay)
            .subscribe(resp => {
                let self = this;
                //refill metric values with xhr result
                resp.forEach(weekInputWM => {
                    if (weekInputWM.isMetricValue) {
                        this.issueWeekInputviewModel.metricValueArray.forEach((metricValue, index) => {
                            let backendIssueMetric = weekInputWM.metricValueArray.find(im => self.isDateEqual(metricValue.inputDate, im.inputDate));
                            if (backendIssueMetric) {
                                metricValue.metricValues = backendIssueMetric.metricValues;
                                metricValue.id = backendIssueMetric.id;
                                metricValue.inputDate = DateHelper.UTCToLocal(metricValue.inputDate);
                            }
                        });
                    } else {
                        if (weekInputWM.reasonValueArray.length > 0) {
                            let targetReasonWeekInputVM = this.reasonWeekInputViewModelArray.find(reasonWeekInputVm => reasonWeekInputVm.reasonValueArray[0].reason.id == weekInputWM.reasonValueArray[0].reason.id);
                            if (targetReasonWeekInputVM) {
                                targetReasonWeekInputVM.reasonValueArray.forEach((reasonMetric, index) => {
                                    let backendReasonMetric = weekInputWM.reasonValueArray.find(rm => self.isDateEqual(reasonMetric.inputDate, rm.inputDate));
                                    if (backendReasonMetric) {
                                        reasonMetric.reasonMetricValues = backendReasonMetric.reasonMetricValues;
                                        reasonMetric.id = backendReasonMetric.id;
                                        reasonMetric.inputDate = DateHelper.UTCToLocal(reasonMetric.inputDate);
                                    }
                                });
                            }
                        }
                    }
                });
                this.currentMetricValues = this.recalcMetricValues();
                this.afterXHRRequest = true;
                this.requestCompleted = true;
            });
    }

    createReason() {
        this.toAddReason.name = '';
        this.addReason.openDialog();
    }


    recalcMetricValues() {
        return this.metricValueService.getMetricJSON(this.currentIssue, this.issueReasons, this.issueWeekInputviewModel, this.reasonWeekInputViewModelArray);
    }

    resetCurrentIssue() {
        this.metricValue = this.currentIssue.metric;
        this.issueName = this.currentIssue.name;
    }

    isCurrentIssueChanged() {
        if (!this.currentIssue.id)
            return false;
        if ((this.currentIssue.metric != this.metricValue && this.currentIssue.isMetricEditable) || (this.currentIssue.name != this.issueName && this.currentIssue.isNameEditable))
            return true;
        return false;
    }


    checkIfInputData() {
        if (this.isMetricReasonContainerVisible == false)
            return true;
        if (this.afterXHRRequest == true && (!(this.currentMetricValues == this.recalcMetricValues())))
            return false;
        return true;
    }

    checkAllowClick(event: boolean) {
        if (!this.checkIfInputData()) {
            this.allowIssueClick.allowClick = false;
            this.popupConfirmOrOkBox('issueList');
        } else {
            this.allowIssueClick.allowClick = true;
        }
        return false;
    }

    checkAllowWeekClick(event: boolean) {
        if (!this.checkIfInputData()) {
            this.allowWeekClick.allowClick = false;
            this.popupConfirmOrOkBox('weekSelector');
        } else {
            this.allowWeekClick.allowClick = true;
        }
        return false;
    }

    checkData() {
        let checkResult = true;
        this.issueWeekInputviewModel.metricValueArray.forEach(metricValue => {
            if (this.checkAndResetNaN(metricValue))
                checkResult = false;
        });
        this.reasonWeekInputViewModelArray.forEach(reasonWeekInputViewModel => {
            reasonWeekInputViewModel.reasonValueArray.forEach(reasonMetric => {
                if (this.checkAndResetNaN(reasonMetric))
                    checkResult = false;
            });
        });
        return checkResult;
    }

    checkAndResetNaN(metric: any): boolean{
        if (metric.constructor.name == 'MetricValue') {
            let metricValue = metric as MetricValue;
            return isNaN(metricValue.metricValues);
        } else {
            let reasonMetric = metric as ReasonMetric;
            return isNaN(reasonMetric.reasonMetricValues);
        }
    }

    confirmSave() {
        this.popupConfirmOrOkBox('default');
    }

    afterClickInvalid(event: boolean) {
        return false;
    }

    reloadIfMetricStateChange() {
        let originalIssue = JSON.parse(this.currentMetricValues)['issue'] as Issue;
        if (originalIssue.issueState != this.currentIssue.issueState) {
            window.location.reload();
        }
    }

    afterClickConfirmOrCancel(event: boolean) {
        if (event) {
            if (!this.checkData()) {
                this.popupConfirmOrOkBox();
            } else {
                this.requestCompleted = false;
                this.resetIssueAndReasonEditable();
                this.saveData()
                    .subscribe(resp => {
                        this.toAddReason.name = '';
                        this.requestCompleted = true;
                        this.filterReason(this.selectedReasonState.value);
                        this.issueList.updateIssue(this.currentIssue);
                        this.reloadIfMetricStateChange();
                    });
            }
            
        }
        return false;
    }

    afterClickConfirmOrCancelFromIssueList(event: boolean) {
        if (event) {
            if (!this.checkData()) {
                this.popupConfirmOrOkBox();
            } else {
                this.requestCompleted = false;
                this.resetIssueAndReasonEditable();
                this.saveData()
                    .subscribe(resp => {
                        this.toAddReason.name = '';
                        this.issueList.updateIssue(this.currentIssue);
                        this.issueList.doNavigate();
                        this.requestCompleted = true;
                    });
            }
        } else {
            this.issueList.doNavigate();
        }
        return false;
    }

    afterClickConfirmOrCancelFromWeekSelector(event: boolean) {
        if (event) {
            if (!this.checkData()) {
                this.popupConfirmOrOkBox();
            } else {
                this.requestCompleted = false;
                this.resetIssueAndReasonEditable();
                this.saveData()
                    .subscribe(resp => {
                        this.toAddReason.name = '';
                        this.issueList.updateIssue(this.currentIssue);
                        this.weekSelector.changeWeek();
                        this.requestCompleted = true;
                        this.reloadIfMetricStateChange();
                    });
            }
        } else {
            this.weekSelector.changeWeek();
            this.metricValueService.cancelMetricAndReasonsEdit(this.currentMetricValues, this.currentIssue, this.issueReasons);
        }
        return false;
    }

    resetIssueAndReasonEditable() {
        this.currentIssue.isMetricEditable = false;
        this.currentIssue.isNameEditable = false;
        this.issueReasons.forEach(reason => reason.isEditable = false);
    }

    updateIssueAndReasonState() {
        let self = this;
        this.currentIssue.issueState = (function () {
            return jQuery('#' + self.metricToggleId).next('label').hasClass('is-selected') ? IssueState.active : IssueState.closed;
        })();
        this.issueReasons.forEach(reason => {
            reason.reasonState = (function () {
                return jQuery('#' + self.reasonToggleId + '-' + reason.id).next('label').hasClass('is-selected') ? State.active : State.closed;
            })();
        });
    }

    clickSave() {
        if (this.checkData()) {
            this.afterClickConfirmOrCancel(true);
        } else {
            this.popupConfirmOrOkBox();
        }
    }

    saveData(): Observable<boolean> {
        this.updateIssueAndReasonState();
        return this.metricValueService.updateMetricValues(
            this.issueWeekInputviewModel.metricValueArray,
            this.reasonWeekInputViewModelArray.map(reasonWeekVM => reasonWeekVM.reasonValueArray),
            this.currentMetricValues
        );
    }

    popupConfirmOrOkBox(id?: string) {
        if (id == undefined || id == null || id == '')
            new fabric['Dialog'](jQuery('.invalid-input-dialog.no-confirm').find('.ms-Dialog').get(0)).open();
        else
            new fabric['Dialog'](jQuery('#'+id +'.invalid-input-dialog.confirm').find('.ms-Dialog').get(0)).open();
    }

    editIssueMetric(isEdit:boolean) {
        this.currentIssue.isMetricEditable = isEdit;
    }

    editIssueName(isEdit: boolean) {
        this.currentIssue.isNameEditable = isEdit;
    }

    editReason(reason: Reason, isEdit: boolean) {
        reason.isEditable = isEdit;
    }

    toggleMetric() {
        var self = this;
        setTimeout(function () {
            self.updateIssueAndReasonState();
            var reasonState = (self.currentIssue.issueState == IssueState.active) ? State.active : State.closed;
            self.issueReasons.forEach(reason => {
                reason.reasonState = reasonState;
            });
        }, 50);
    }

    toggleReason() {
        var self = this;
        setTimeout(function () {
            self.updateIssueAndReasonState();
        }, 50);
    }
}