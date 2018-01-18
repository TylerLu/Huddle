import { MetricValue } from './metricValue';
import { ReasonValue } from './reasonValue';
import { WeekDay } from './weekDay';
import { Issue } from './issue';
import { CommonUtil } from '../../utils/commonUtil';

export class WeekInputViewModel {
    readonly inputLength: number = 7;
    weekDay: WeekDay;
    isMetricValue: boolean;
    isWeeklyReason: boolean;
    metricValueArray = new Array<MetricValue>();
    reasonValueArray = new Array<ReasonValue>();
    constructor() {
        for (let i = 0; i < this.inputLength; i++){
            this.metricValueArray.push(new MetricValue());
            this.reasonValueArray.push(new ReasonValue());
        }
    }
    public displayValueType(): string{
        let valueType = '';
        if (this.metricValueArray.length > 0) {
            valueType = this.metricValueArray[0].metric.valueType;
        }
        if (this.reasonValueArray.length > 0) {
            valueType = this.reasonValueArray[0].reason.valueType;
        }
        return CommonUtil.getDisplayValueType(valueType);
    }
    public resetIssue(issue: Issue) {
        //this.metricValueArray.forEach(metricValue => {
        //    metricValue.issue = issue;
        //});
    }
}