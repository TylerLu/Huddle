import { Injectable, Inject } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs/Rx';
import { DataService } from '../services/data.service';
import { Issue } from '../shared/models/issue';
import { Category } from '../shared/models/category';
import { Reason} from '../shared/models/reason';
import { State} from '../shared/models/state';
import { Constants } from '../shared/constants';
import { ModelConverter } from '../utils/modelConverter';
import { DateHelper } from '../utils/dateHelper';

@Injectable()
export class ReasonService {

    constructor(private dataService: DataService) { }

    public addReason(reason: Reason): Observable<number> {
        let activeObject: ReplaySubject<number> = new ReplaySubject(1);
        this.dataService.post(Constants.webAPI.reasonsUrl, { reason: ModelConverter.ToReasonBackend(reason) })
            .subscribe(
            resp => {
                activeObject.next(resp.reasonId);
            },
            error => activeObject.error(error));
        return activeObject;
    }

    public updateReasonState(){
        
    }

    public getReasonsByIssue(issueId: number, state: State): Observable<Array<Reason>> {
        let activeObject: ReplaySubject<Reason[]> = new ReplaySubject(1);
        this.dataService.getArray<Reason>(Constants.webAPI.reasonsUrl + "/" + issueId + "/" + state)
            .subscribe((resp) => {
                let result: Reason[] = [];
                resp.forEach(function (reason, index) {
                    reason.startDate = DateHelper.UTCToLocal(reason.startDate);
                    reason.isEditable = false;
                    result.push(reason);
                }, this);
                activeObject.next(result);
            },
            (error) => { activeObject.error(error) });
        return activeObject;
    }

}