import { Injectable, Inject } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs/Rx';
import { DataService } from '../services/data.service';
import { Issue } from '../shared/models/issue';
import { Category } from '../shared/models/category';
import { Reason } from '../shared/models/reason';
import { Metric } from '../shared/models/metric';
import { State} from '../shared/models/state';
import { Constants } from '../shared/constants';
import { ModelConverter } from '../utils/modelConverter';
import { DateHelper } from '../utils/dateHelper';

@Injectable()
export class ReasonService {

    constructor(private dataService: DataService) { }

    public addReason(reason: Reason): Observable<number> {
        let activeObject: ReplaySubject<number> = new ReplaySubject(1);
        let convertedReason = ModelConverter.ToReasonBackend(reason);
        this.dataService.post(Constants.webAPI.reasonsUrl, { reason: convertedReason })
            .subscribe(
            resp => {
                activeObject.next(resp.reasonId);
            },
            error => activeObject.error(error));
        return activeObject;
    }

    public editReason(reason: Reason): Observable<number> {
        let activeObject: ReplaySubject<number> = new ReplaySubject(1);
        let convertedReason = ModelConverter.ToReasonBackend(reason);
        this.dataService.post(Constants.webAPI.reasonEditUrl, { reason: convertedReason })
            .subscribe(
            resp => {
                activeObject.next(resp.reasonId);
            },
            error => activeObject.error(error));
        return activeObject;
    }

    public getReasonById(id: number): Observable<Reason> {
        let activeObject: ReplaySubject<Reason> = new ReplaySubject(1);
        this.dataService.getObject<Reason>(Constants.webAPI.reasonsUrl + "/" + id.toString())
            .subscribe((reason) => {
                activeObject.next(reason);
            },
            (error) => {
                activeObject.error(error);
            });
        return activeObject;
    }

    public getReasonsByMetric(metricId: number): Observable<Array<Reason>> {
        let activeObject: ReplaySubject<Reason[]> = new ReplaySubject(1);
        this.dataService.getArray<Reason>(Constants.webAPI.reasonsListUrl + "/" + metricId )
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

    public updateReasonStatus(reasonId: number): void {
        this.dataService.post(Constants.webAPI.reasonStatusUrl + "/" + reasonId, null);
    }

}