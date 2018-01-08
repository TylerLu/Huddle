import { Injectable, Inject } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs/Rx';
import { DataService } from '../services/data.service';
import { Issue } from '../shared/models/issue';
import { Category } from '../shared/models/category';
import { Metric } from '../shared/models/metric';
import { State } from '../shared/models/state';
import { Constants } from '../shared/constants';
import { ModelConverter } from '../utils/modelConverter';
import { DateHelper } from '../utils/dateHelper';

@Injectable()
export class MetricService {

    constructor(private dataService: DataService) { }



    public getMetricsById(metricId: number): Observable<Metric[]> {
        let activeObject: ReplaySubject<Metric[]> = new ReplaySubject(1);
        this.dataService.getObject<Metric[]>(Constants.webAPI.metricUrl + "/" + metricId)
            .subscribe((metricArray) => {
                metricArray.forEach(metric => metric.startDate = DateHelper.UTCToLocal(metric.startDate));
                activeObject.next(metricArray);
            },
            (error) => {
                activeObject.error(error);
            });
        return activeObject;
    }

}