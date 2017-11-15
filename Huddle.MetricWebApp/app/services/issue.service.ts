import { Injectable, Inject } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs/Rx';
import { DataService} from '../services/data.service';
import { Issue } from '../shared/models/issue';
import { Category} from '../shared/models/category';
import { Reason} from '../shared/models/reason';
import { Constants } from '../shared/constants';
import { ModelConverter } from '../utils/modelConverter';
import { DateHelper } from '../utils/dateHelper';

@Injectable()
export class IssueService {

    constructor(private dataService: DataService) { }

    public filterIssueList(state:number,teamId:string): Observable<Issue[]> {
        let activeObject: ReplaySubject<Issue[]> = new ReplaySubject(1);
        this.dataService.getArray<Issue>(Constants.webAPI.issuesFilterUrl + "/" + state + "/" + teamId+'/')
            .subscribe((resp) => {
                let result: Issue[] = [];
                resp.forEach(function (issue, index) {
                    issue.startDate = DateHelper.UTCToLocal(issue.startDate);
                    result.push(issue);
                }, this);
                activeObject.next(result);
            },
            (error) => { activeObject.error(error) });
        return activeObject;
    }

    public getCategories(): Observable<Array<Category>> {
        let activeObject: ReplaySubject<Category[]> = new ReplaySubject(1);
        this.dataService.getArray<Category>(Constants.webAPI.categoriesUrl + '/')
            .subscribe((resp) => {
                let result: Issue[] = [];
                resp.forEach(function (category, index) {
                    result.push(category);
                }, this);
                activeObject.next(result);
            },
            (error) => { activeObject.error(error) });
        return activeObject;
    }

    public getIssueById(issueId: number): Observable<Issue> {
        let activeObject: ReplaySubject<Issue> = new ReplaySubject(1);
        this.dataService.getObject<Issue>(Constants.webAPI.issuesUrl + "/" + issueId.toString())
            .subscribe((issue) => {
                issue.startDate = DateHelper.UTCToLocal(issue.startDate);
                issue.isMetricEditable = false;
                issue.isNameEditable = false;
                activeObject.next(issue);
            },
            (error) => {
                activeObject.error(error);
            });
        return activeObject;
    }

    public addIssue(issue: Issue, reasons: Reason[], teamId: string): Observable<number> {
        let activeObject: ReplaySubject<number> = new ReplaySubject(1);
        this.dataService.post(Constants.webAPI.issuesUrl, { issue: ModelConverter.ToIssueBackend(issue), reasons: ModelConverter.ToReasonListBackend(reasons), teamId: teamId })
            .subscribe(
            resp => {
                activeObject.next(resp.issueId);
            },
            error => activeObject.error(error));
        return activeObject;
    }

}