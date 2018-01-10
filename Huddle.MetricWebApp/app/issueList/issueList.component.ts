import { Component, OnInit, AfterViewChecked,Input, Output, EventEmitter, ViewChild, ViewChildren, QueryList, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from '../services/cookie.service';
import { IssueService } from '../services/issue.service';
import { Issue } from '../shared/models/issue';
import { Metric} from '../shared/models/metric';
import { Reason} from '../shared/models/reason';
import { IssueState } from '../shared/models/issueState';
import { IssueViewModel } from './issue.viewmodel';
import { AllowIssueClick } from '../shared/models/allowIssueClick';
import { IssueStateViewModel } from '../shared/models/issueState.viewmodel';
import { Constants } from '../shared/constants';
import { FabricHelper } from '../utils/fabricHelper';
import { CommonUtil } from '../utils/commonUtil';
import { AddIssueComponent } from '../issue/addIssue.component';
import { EditIssueComponent } from '../issue/editIssue.component';
import { HeaderComponent} from '../header/header.component';
import { QueryResult} from '../shared/models/queryResult';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { MetricListComponent } from '../metric/metricList.component';
declare var microsoftTeams: any;

@Component({
    templateUrl: 'app/issueList/issueList.component.html',
    selector: 'issue-list',
    styleUrls: ['app/issueList/issueList.component.css', 'app/shared/shared.css']
})

export class IssueListComponent implements OnInit, AfterViewChecked {

    issueArray = new Array<IssueViewModel>();
    selectedIssueState = new IssueStateViewModel();
    isCreateBtnVisible = true;
    selectedIssue: IssueViewModel;
    teamId = Constants.teamId;
    @Input('allowClick') allowClick: AllowIssueClick;
    @Output() afterCheckAllowClick: EventEmitter<boolean> = new EventEmitter<boolean>();
    isNewIssueButtonClicked: boolean;
    toEditIssue: Issue;

    isRequestCompleted: boolean;

    @ViewChild(AddIssueComponent)
    private addIssue: AddIssueComponent; 

    @ViewChild(EditIssueComponent)
    private editIssue: EditIssueComponent; 

    @ViewChild(HeaderComponent)
    private header: HeaderComponent;

    @ViewChildren('metricLists')
    metricLists:QueryList<MetricListComponent>;

    @ViewChild('modalAddIssue')
    modalAddIssue: ModalComponent;

    @ViewChild('modalEditIssue')
    modalEditIssue: ModalComponent;

    enable: boolean;

    constructor(private issueService: IssueService, private router: Router, private activateRoute: ActivatedRoute, private cookieService: CookieService,private cdRef:ChangeDetectorRef) {
    }

    ngOnInit(): void {
        if (CommonUtil.isInMsTeam()) {
            this.initTeamContext();
        } else {
            this.initTeamContext();
        }
        this.isNewIssueButtonClicked = false;
        this.isRequestCompleted = false;
    }

    ngAfterViewChecked() {
        this.expandDefaultIssue();
        this.cdRef.detectChanges();
    }

    initIssues() {        
        this.initIssueStates();
    }

    isMetricUrl(): boolean {
        return location.pathname.indexOf(Constants.route.metricIssue) >= 0;
    }

    getIssueId(): number {
        let issueIdStr = this.cookieService.get("issueId");
        if (issueIdStr != '')
            return parseInt(issueIdStr);
        return 0;
    }

    initSelectedIssue() {
        if (this.isMetricUrl()) {
            this.issueArray.forEach(issue => {
                if (this.selectedIssue && this.selectedIssue.Issue && issue.Issue.id == this.selectedIssue.Issue.id) {
                    issue.IsSelected = true;
                }
            });
        }
    }

    initTeamContext() {
        this.teamId = CommonUtil.getTeamId();
        this.initIssues();
    }


    initIssueStates() {
        this.selectedIssueState = this.header.selectedIssueState;
         
        let issueId = this.getIssueId();
        if (issueId > 0) {
            this.issueService.getIssueById(issueId)
                .subscribe(issue => {
                    this.selectedIssue = new IssueViewModel();
                    this.selectedIssue.Issue = issue;
                    this.selectedIssueState = this.selectedIssueState;
                    this.doFilterIssues(this.selectedIssueState.value);
                });
        } else {
            this.selectedIssueState = this.selectedIssueState;
            this.doFilterIssues(this.selectedIssueState.value);
        }
    }

    clickIssue(item: IssueViewModel) {
        this.issueArray.forEach(item => item.IsSelected = false);
        item.IsSelected = true;
        this.selectedIssue = item;
        this.afterCheckAllowClick.emit(false);
        if (this.allowClick.allowClick)
            this.doNavigateIssue(item);
    }


    doNavigateIssue(item?: IssueViewModel){
        if (item && item.Issue) {
            this.cookieService.put("issueId", item.Issue.id.toString());
            //open issue
        } else {
            //open first issue;
        }
    }

    doNavigate() {
        if (!this.isNewIssueButtonClicked)
            this.doNavigateIssue(this.selectedIssue);
        else
            this.doNavigateIssue();
    }

    doFilterIssues(state: number) {
        this.issueService.filterIssueList(state, this.teamId)
            .subscribe(resp => {
                this.issueArray = resp.map( (issue,index) => {
                    let issueModel = new IssueViewModel();
                    issueModel.Issue = issue;
                    issueModel.IsSelected = false;
                    return issueModel;
                });
                this.isRequestCompleted = true;
            });
    }

    createIssue() {
        this.isNewIssueButtonClicked = true;
        this.afterCheckAllowClick.emit(false);
        if (this.allowClick.allowClick) {
            this.addIssue.open();
        }
    }

    issueAdded(event: Issue) {
        if (event.id <= 0)
            return;
        this.issueArray.forEach(item => item.IsSelected = false);
        let newIssueModel = new IssueViewModel();
        newIssueModel.IsSelected = true;
        newIssueModel.IssueState = IssueState.active.toString();
        newIssueModel.Issue = event;
        this.issueArray.push(newIssueModel);
        this.doNavigateIssue(newIssueModel);
    }

    updateIssue(updatedIssue: Issue) {
        let findResult = this.issueArray.filter(issue => issue.Issue.id == updatedIssue.id);
        if (findResult.length == 0)
            return;
        findResult[0].Issue.name = updatedIssue.name;
        findResult[0].Issue.metric = updatedIssue.metric;
    }

    afterFilterIssue(issueState: IssueStateViewModel) {
        this.doFilterIssues(issueState.value);
    }



    afterQuerySelected(selectedItem: QueryResult) {
        let selectedIssue: IssueViewModel;
        if (selectedItem['category'] !== undefined) {//issue
            let searchedIssues = this.issueArray.filter((issue, index) => {
                return issue.Issue.id == selectedItem.id;
            });
            if (searchedIssues.length > 0) {
                selectedIssue = searchedIssues[0];
            }
        } else if (selectedItem['issue'] !== undefined) {//metric
            this.issueArray.forEach(issue => {
                if (issue.Issue.id == (selectedItem as Metric).issue.id) {
                    selectedIssue = issue;
                }
            });
        } else {//reason
            this.issueArray.forEach(issue => {
                if (issue.Issue.id == (selectedItem as Reason).metric.issue.id) {
                    selectedIssue = issue;
                }
            });
        }

        if (selectedIssue != null) {
            this.expandIssue(selectedIssue);
        }
    }

   

    //popup issue
    addIssueClick() {
        this.modalAddIssue.open();
    }
    closed() {
    }

    dismissed() {
    }

    opened() {
        this.addIssue.open();
    }

    editIssueOpened() {
        this.editIssue.open(this.toEditIssue.id);
    }

    //switch
    onSwitch(a: any) {
        console.log(a);
    }

    checkAllowWeekClick(event: boolean) {
        this.header.checkAllowWeekClick(event);
    }

    expandDefaultIssue() {
        if (this.issueArray.length === 0)
            return;
        if(this.issueArray.filter(issue => issue.Expanded == true).length===0)
            this.expandIssue(this.issueArray[0]);
    }

    expandIssueClick(issue: IssueViewModel) {
        if (issue.Expanded)
            issue.Expanded = false;
        else
            this.expandIssue(issue);
    }

    expandIssue(issue: IssueViewModel) {        
        this.issueArray.forEach(issue => {
            issue.Expanded = false;
            let metricList = this.getRelatedMetricList(issue);
            if (metricList !== null)
                metricList.hide();
        });
        issue.Expanded = true;
        let currentMetricList = this.getRelatedMetricList(issue);
        if (currentMetricList!==null)
            currentMetricList.show();
    }

    getRelatedMetricList(issue: IssueViewModel) {
        let result = this.metricLists.filter(metricList => metricList.currentIssue.id == issue.Issue.id);
        if (result.length > 0)
            return result[0];
        return null;
    }

    getMetricAndReasonValues() {
        
    }

    editIssueClick(issue: IssueViewModel) {
        this.toEditIssue = issue.Issue;
        this.modalEditIssue.open();
    }

    saveIssueClick(issue: IssueViewModel) {
        console.log(issue);
    }

    afterCloseNewIssue(toAddIssue: Issue) {
        this.modalAddIssue.close();
    }

    afterCloseEditIssue(toEditIssue: Issue) {
        this.modalEditIssue.close();
    }

}
