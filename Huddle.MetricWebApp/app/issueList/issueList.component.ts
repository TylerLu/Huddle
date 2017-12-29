import { Component, OnInit, AfterViewChecked, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from '../services/cookie.service';
import { IssueService } from '../services/issue.service';
import { Issue } from '../shared/models/issue';
import { IssueState } from '../shared/models/issueState';
import { IssueViewModel } from './issue.viewmodel';
import { AllowIssueClick } from '../shared/models/allowIssueClick';
import { IssueStateViewModel } from './issueState.viewmodel';
import { Constants } from '../shared/constants';
import { FabricHelper } from '../utils/fabricHelper';
import { CommonUtil } from '../utils/commonUtil';
import { AddIssueComponent } from '../issue/addIssue.component';
declare var microsoftTeams: any;

@Component({
    templateUrl: 'app/issueList/issueList.component.html',
    selector: 'issue-list',
    styleUrls: ['app/issueList/issueList.component.css', 'app/shared/shared.css']
})

export class IssueListComponent implements OnInit {

    displayedIssueArray = new Array<IssueViewModel>();
    displayedIssueArrayLength = 6;

    issueArray = new Array<IssueViewModel>();
    issueStates = new Array<IssueStateViewModel>();
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
        let issueIdStr = '';
        if (this.isMetricUrl()) {
            issueIdStr = location.pathname.replace('/' + Constants.route.metricIssue + '/', '');
        } else {
            issueIdStr = this.cookieService.get("issueId");
        }
        if (issueIdStr != '')
            return parseInt(issueIdStr);
        else
            return 0;
    }

    initSelectedIssue() {
        if (this.isMetricUrl()) {
            this.issueArray.forEach(issue => {
                if (this.selectedIssue && this.selectedIssue.Issue && issue.Issue.id == this.selectedIssue.Issue.id) {
                    issue.IsSelected = true;
                }
            });
            this.resetDisplayIssueArray();
        }
    }

    initTeamContext() {
        this.teamId = CommonUtil.getTeamId();
        this.initIssues();
    }


    initIssueStates() {
        let issue1 = new IssueStateViewModel();
        issue1.title = IssueState[IssueState.active];
        issue1.value = IssueState.active;
        this.issueStates.push(issue1);

        let issue2 = new IssueStateViewModel();
        issue2.title = IssueState[IssueState.closed];
        issue2.value = IssueState.closed;
        this.issueStates.push(issue2);

        let issueId = this.getIssueId();
        if (issueId > 0) {
            this.issueService.getIssueById(issueId)
                .subscribe(issue => {
                    this.selectedIssue = new IssueViewModel();
                    this.selectedIssue.Issue = issue;
                    this.selectedIssueState = issue.issueState == IssueState.active?issue1:issue2;
                    this.doFilterIssues(this.selectedIssueState.value);
                });
        } else {
            this.selectedIssueState = issue1;
            this.doFilterIssues(this.selectedIssueState.value);
        }
    }

    clickIssue(item: IssueViewModel) {
        this.displayedIssueArray.forEach(item => item.IsSelected = false);
        item.IsSelected = true;
        this.selectedIssue = item;
        this.afterCheckAllowClick.emit(false);
        if (this.allowClick.allowClick)
            this.doNavigateIssue(item);
    }


    doNavigateIssue(item?: IssueViewModel): Promise<boolean>{
        if (item && item.Issue) {
            this.cookieService.put("issueId", item.Issue.id.toString());
            return CommonUtil.navigateToUrl('/' + Constants.route.metricIssue + '/' + item.Issue.id, this.router);
        } else {
            return CommonUtil.navigateToUrl('/' + Constants.route.addIssue, this.router);
        }
    }

    doNavigate() {
        if (!this.isNewIssueButtonClicked)
            this.doNavigateIssue(this.selectedIssue);
        else
            this.doNavigateIssue();
    }

    doFilterIssues(state: number, ifClearSelectedIssue?: boolean) {
        if (ifClearSelectedIssue == true)
            this.selectedIssue = null;
        this.issueService.filterIssueList(state, this.teamId)
            .subscribe(resp => {
                this.issueArray = resp.map(issue => {
                    let issueModel = new IssueViewModel();
                    issueModel.Issue = issue;
                    issueModel.IsSelected = false;
                    return issueModel;
                });
                this.resetDisplayIssueArray();
                if (ifClearSelectedIssue == null) {
                    if (this.isMetricUrl()) {
                        this.initSelectedIssue();
                    }
                }
                let self = this;
                if (this.displayedIssueArray.length > 0) {
                    if (this.selectedIssue && this.selectedIssue.Issue && this.selectedIssue.Issue.id) {
                        this.doNavigateIssue(this.selectedIssue)
                            .then(function () {
                                self.initSelectedIssue();
                            });
                    } else {
                        this.doNavigateIssue(this.displayedIssueArray[0])
                            .then(function () {
                                self.selectedIssue = self.displayedIssueArray[0];
                                self.initSelectedIssue();
                            });
                    }
                } else {
                    let emptyIssue = new IssueViewModel();
                    emptyIssue.Issue = new Issue();
                    emptyIssue.Issue.id = 0;
                    this.doNavigateIssue(emptyIssue);
                }
                this.isRequestCompleted = true;
            });
    }

    resetDisplayIssueArray(scrollUp?: boolean) {
        if (this.issueArray.length == 0)
            this.displayedIssueArray = new Array<IssueViewModel>();
        if (scrollUp == null) {
            if (this.selectedIssue == null || this.displayedIssueArray.length ==0) {
                this.displayedIssueArray = this.issueArray.slice(0, this.displayedIssueArrayLength);
            } else {
                let selectedIssueIndex = -1;
                this.issueArray.forEach((issue, index) => {
                    if (issue.Issue.id == this.selectedIssue.Issue.id)
                        selectedIssueIndex = index;
                });
                if (selectedIssueIndex > this.displayedIssueArray.length)
                    this.displayedIssueArray = this.issueArray.slice(selectedIssueIndex - this.displayedIssueArrayLength + 1, selectedIssueIndex + 1);
                else
                    this.displayedIssueArray = this.issueArray.slice(selectedIssueIndex, selectedIssueIndex + this.displayedIssueArrayLength);
            }

        } else {
            let currentIssueIndex = -1;
            this.issueArray.forEach((issue, index) => {
                    if (issue.Issue.id == this.displayedIssueArray[0].Issue.id)
                        currentIssueIndex = index;
            });
            if (scrollUp == true) {
                if (this.displayedIssueArray[0].Issue.id == this.issueArray[0].Issue.id)
                    return false;
                this.displayedIssueArray = this.issueArray.slice(currentIssueIndex - 1, currentIssueIndex - 1 + this.displayedIssueArrayLength);
            } else if (scrollUp == false) {
                if (this.displayedIssueArray[this.displayedIssueArray.length - 1].Issue.id == this.issueArray[this.issueArray.length - 1].Issue.id)
                    return false;
                this.displayedIssueArray = this.issueArray.slice(currentIssueIndex + 1, currentIssueIndex + 1 + this.displayedIssueArrayLength);
            } 
            
        }
        return false;
    }

    filterIssueState(state: number, ifClearSelectedIssue?: boolean) {
        this.doFilterIssues(state, ifClearSelectedIssue);
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
        this.displayedIssueArray.forEach(item => item.IsSelected = false);
        let newIssueModel = new IssueViewModel();
        newIssueModel.IsSelected = true;
        newIssueModel.IssueState = IssueState.active.toString();
        newIssueModel.Issue = event;
        this.issueArray.push(newIssueModel);
        this.doNavigateIssue(newIssueModel);
        this.resetDisplayIssueArray();
    }

    updateIssue(updatedIssue: Issue) {
        let findResult = this.displayedIssueArray.filter(issue => issue.Issue.id == updatedIssue.id);
        if (findResult.length == 0)
            return;
        findResult[0].Issue.name = updatedIssue.name;
        findResult[0].Issue.metric = updatedIssue.metric;
    }
}
