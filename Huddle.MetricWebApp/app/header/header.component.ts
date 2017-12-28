import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs/Rx';
import { IssueState } from '../shared/models/issueState';
import { IssueStateViewModel } from '../shared/models/issueState.viewmodel';
import { IssueViewModel } from '../issueList/issue.viewmodel';
import { Issue } from '../shared/models/issue';
import { Constants} from '../shared/constants';
import { IssueService } from '../services/issue.service';
import { DataService} from '../services/data.service';

@Component({
    templateUrl: 'app/header/header.component.html',
    selector: 'header',
    styleUrls: ['app/header/header.component.css', 'app/shared/shared.css']
})

export class HeaderComponent implements OnInit {
    @Input('displayTitle') displayTitle: string; 
    @Output() filterIssueState: EventEmitter<IssueStateViewModel> = new EventEmitter<IssueStateViewModel>();

    issueStates = new Array<IssueStateViewModel>();
    selectedIssueState: IssueStateViewModel;

    selectedIssue: IssueViewModel;
    //suggestedIssues: Observable<IssueViewModel>;

    constructor(private issueService: IssueService,private dataService:DataService) {
        this.initIssueStates();
    }
    ngOnInit(): void {
        
    }


    initIssueStates() {
        let issueActive = new IssueStateViewModel();
        issueActive.title = IssueState[IssueState.active];
        issueActive.value = IssueState.active;
        this.issueStates.push(issueActive);

        let issueClosed = new IssueStateViewModel();
        issueClosed.title = IssueState[IssueState.closed];
        issueClosed.value = IssueState.closed;
        this.issueStates.push(issueClosed);

        this.selectedIssueState = issueActive;
    }

    changeIssueFilter(issueState) {
        this.filterIssueState.emit(issueState);
    }

    suggestFormatter(data: IssueViewModel): string {
        return `${data.Issue.name}`;
    }

    suggestedIssues = (keyword: any): Observable<IssueViewModel[]> => {
        if (keyword && keyword.length >= Constants.suggestCharNum) {
            return this.issueService.queryIssues(keyword)
            .map(res => {
                return res;
            })
        } else {
          return Observable.of([]);
        }
    }

}