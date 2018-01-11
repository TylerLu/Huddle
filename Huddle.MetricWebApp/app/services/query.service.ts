import { Injectable, Inject } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs/Rx';
import { DataService } from '../services/data.service';
import { Issue } from '../shared/models/issue';
import { IssueViewModel } from '../issueList/issue.viewmodel';
import { Metric } from '../shared/models/metric';
import { Category } from '../shared/models/category';
import { Reason } from '../shared/models/reason';
import { QueryResult} from '../shared/models/queryResult';
import { Constants } from '../shared/constants';
import { ModelConverter } from '../utils/modelConverter';
import { DateHelper } from '../utils/dateHelper';

@Injectable()
export class QueryService {

    constructor(private dataService: DataService) { }

    public searchQuery(state:number,keyword:string,teamId:string): Observable<QueryResult[]> {
        let activeObject: ReplaySubject<QueryResult[]> = new ReplaySubject(1);
        this.dataService.getArray<QueryResult>(Constants.webAPI.queryUrl + "/" + state + "/" + keyword +'/'+ teamId +'/')
            .subscribe((resp) => {
                let result: QueryResult[] = [];
                resp.forEach(function (item, index) {
                    result.push(item);
                }, this);
                activeObject.next(result);
            },
            (error) => { activeObject.error(error) });
        return activeObject;
    }
}