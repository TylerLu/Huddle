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
import { Constants } from '../shared/constants';
import { CommonUtil } from '../utils/commonUtil';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { ReasonListComponent } from '../reason/reasonList.component';
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

    @Input('currentIssue') currentIssue: Issue;

    @ViewChildren('reasonLists')
    reasonLists:QueryList<ReasonListComponent>;

    constructor(private metricService: MetricService, private router: Router, private activateRoute: ActivatedRoute, private cookieService: CookieService) {
    }

    ngOnInit(): void {
        this.initTeamContext();
    }

    show() {
        this.ifHidden = false;
        this.metricService.getMetricsById(this.currentIssue.id)
            .subscribe(resp => {
                this.metricArray = resp.map((metric, index) => {
                    metric.issue = this.currentIssue;
                    let metricViewModel = new MetricViewModel();
                    metricViewModel.metric = metric;
                    metricViewModel.expanded = false;
                    return metricViewModel;
                });
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

    editMetricClick() {
    }

    addMetricClick() {
    }

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
}