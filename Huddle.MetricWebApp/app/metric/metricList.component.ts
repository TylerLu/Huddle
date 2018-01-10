import { Component, OnInit, AfterViewChecked, Input, Output, EventEmitter, ViewChild,ViewChildren,QueryList } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from '../services/cookie.service';
import { MetricService } from '../services/metric.service';
import { Issue } from '../shared/models/issue';
import { Metric} from '../shared/models/metric';
import { Reason} from '../shared/models/reason';
import { IssueState } from '../shared/models/issueState';
import { IssueViewModel } from '../issueList/issue.viewmodel';
import { MetricViewModel } from './metric.viewmodel';
import { WeekDay } from '../shared/models/weekDay';
import { WeekInputViewModel } from '../shared/models/weekInputViewModel';
import { Constants } from '../shared/constants';
import { CommonUtil } from '../utils/commonUtil';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { ReasonListComponent } from '../reason/reasonList.component';
import { DateHelper } from '../utils/dateHelper';
import { AddMetricComponent } from './addMetric.component';
import { EditMetricComponent } from './editMetric.component';

declare var microsoftTeams: any;

@Component({
    templateUrl: 'app/metric/metricList.component.html',
    selector: 'metric-list',
    styleUrls: ['app/metric/metricList.component.css', 'app/shared/shared.css']
})

export class MetricListComponent implements OnInit {

    metricArray = new Array<MetricViewModel>();
    teamId = Constants.teamId;

    ifHidden: boolean = true;
    currentIssueId: number = 0;
    currentMetricId: number = 0;

    @Input('currentIssue') currentIssue: Issue;

    @ViewChildren('reasonLists')
    reasonLists:QueryList<ReasonListComponent>;

    currentWeekDays = new Array<Date>();
    selectWeekDay: WeekDay;
    weekInputviewModel: WeekInputViewModel;

    metricWeekInputViewModelArray = new Array<WeekInputViewModel>();
    reasonWeekInputViewModelArray = new Array<WeekInputViewModel>();

    @ViewChild('modalAddMetric')
    modalAddMetric: ModalComponent;
    @ViewChild(AddMetricComponent)
    addMetricPopUp: AddMetricComponent;

    @ViewChild('modalEditMetric')
    modalEditMetric: ModalComponent;
    @ViewChild(EditMetricComponent)
    editMetricPopUp: EditMetricComponent;

    constructor(private metricService: MetricService,  private router: Router, private activateRoute: ActivatedRoute, private cookieService: CookieService) {
    }

    ngOnInit(): void {
        this.initTeamContext();
    }

    show() {
        this.ifHidden = false;
        this.currentIssueId = this.currentIssue.id;
        this.metricService.getMetricsById(this.currentIssue.id)
            .subscribe(resp => {
                this.metricArray = resp.map((metric, index) => {
                    metric.issue = this.currentIssue;
                    let metricViewModel = new MetricViewModel();
                    metricViewModel.metric = metric;
                    metricViewModel.expanded = false;
                    return metricViewModel;
                });
                this.rebuildWeekInputViewModel();
            });
    }

    hide() {
        this.ifHidden = true;
    }


    initTeamContext() {
        this.teamId = CommonUtil.getTeamId();
    }

    onSwitch() {
    }

    closed() { }

    expandMetricClick(metric: MetricViewModel) {
        this.metricArray.forEach(metric => {
            metric.expanded = false;
            let metricList = this.getRelatedReasonList(metric);
            if (metricList !== null)
                metricList.hide();
        });
        metric.expanded = true;
        let currentMetricList = this.getRelatedReasonList(metric);
        if (currentMetricList!==null)
            currentMetricList.show();
    }

    getRelatedReasonList(metric: MetricViewModel) {
        let result = this.reasonLists.filter(reasonList => reasonList.currentMetric.id == metric.metric.id);
        if (result.length > 0)
            return result[0];
        return null;
    }

    rebuildWeekInputViewModel() {
        //to be replaced with week selector component;
        this.selectWeekDay = DateHelper.getStartAndEndDayOfWeek();
        if (this.metricArray.length > 0) {
            this.metricWeekInputViewModelArray = this.metricArray.map(metricView => {
                return DateHelper.getWeekInputViewModel(false, this.selectWeekDay, metricView.metric, null);
            });
        }
        //this.getMetricValues();
    }

    editMetricClick(id) {
        this.currentMetricId = id;
        this.modalEditMetric.open();
    }

    addMetricClick() {
        this.modalAddMetric.open();
    }

    opened() {
        this.addMetricPopUp.open(this.currentIssue.id);
    }

    editMetricOpened() {
        this.editMetricPopUp.open(this.currentIssue.id, this.currentMetricId);
    }

    afterCloseNewMetric() {
        this.modalAddMetric.close();
    }
    afterCloseEditMetric() {
        this.modalEditMetric.close();
    }
}