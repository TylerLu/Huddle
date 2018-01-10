import { MetricValue } from './metricValue';
import { ReasonMetric } from './reasonMetric';
import { WeekDay } from './weekDay';
import { Issue } from './issue';

export class WeekInputViewModel {
    readonly inputLength: number = 7;
    weekDay: WeekDay;
    isMetricValue: boolean;
    metricValueArray = new Array<MetricValue>();
    reasonValueArray = new Array<ReasonMetric>();
    constructor() {
        for (let i = 0; i < this.inputLength; i++){
            this.metricValueArray.push(new MetricValue());
            this.reasonValueArray.push(new ReasonMetric());
        }
    }
    public resetIssue(issue: Issue) {
        //this.metricValueArray.forEach(metricValue => {
        //    metricValue.issue = issue;
        //});
    }
}