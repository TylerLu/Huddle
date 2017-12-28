import { Component, OnInit, AfterViewChecked, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from '../services/cookie.service';
import { IssueService } from '../services/issue.service';
import { Issue } from '../shared/models/issue';
import { IssueState } from '../shared/models/issueState';
import { IssueViewModel } from './issue.viewmodel';
import { AllowIssueClick } from '../shared/models/allowIssueClick';
import { IssueStateViewModel } from '../shared/models/issueState.viewmodel';
import { Constants } from '../shared/constants';
import { FabricHelper } from '../utils/fabricHelper';
import { CommonUtil } from '../utils/commonUtil';
import { AddIssueComponent } from '../issue/addIssue.component';
import { HeaderComponent} from '../header/header.component';
declare var microsoftTeams: any;

@Component({
    templateUrl: 'app/issueList/issueList.component.html',
    selector: 'issue-list',
    styleUrls: ['app/issueList/issueList.component.css', 'app/shared/shared.css']
})

export class IssueListComponent implements OnInit {

    issueArray = new Array<IssueViewModel>();
    selectedIssueState = new IssueStateViewModel();
    isCreateBtnVisible = true;
    selectedIssue: IssueViewModel;
    teamId = '1';
    @Input('allowClick') allowClick: AllowIssueClick;
    @Output() afterCheckAllowClick: EventEmitter<boolean> = new EventEmitter<boolean>();
    isNewIssueButtonClicked: boolean;

    isRequestCompleted: boolean;

    @ViewChild(AddIssueComponent)
    private addIssue: AddIssueComponent; 

    @ViewChild(HeaderComponent)
    private header: HeaderComponent;

    constructor(private issueService: IssueService, private router: Router, private activateRoute: ActivatedRoute, private cookieService: CookieService) {
    }

    ngOnInit(): void {
        if (CommonUtil.isInMsTeam()) {
            this.initTeamContext();
        } else {
            this.initIssues();
        }
        this.isNewIssueButtonClicked = false;
        this.isRequestCompleted = false;
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
                this.issueArray = resp.map(issue => {
                    let issueModel = new IssueViewModel();
                    issueModel.Issue = issue;
                    issueModel.IsSelected = false;
                    return issueModel;
                });
                
                let self = this;
                if (this.issueArray.length > 0) {
                    if (this.selectedIssue && this.selectedIssue.Issue && this.selectedIssue.Issue.id) {
                        this.doNavigateIssue(this.selectedIssue);
                    } else {
                        this.doNavigateIssue(this.issueArray[0]);
                    }
                } else {
                    let emptyIssue = new IssueViewModel();
                    emptyIssue.Issue = new Issue();
                    emptyIssue.Issue.id = 0;
                    this.doNavigateIssue(emptyIssue);
                }
                this.isRequestCompleted = true;
                this.issueArray.forEach(issue => issue.Expanded = true);
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
}
