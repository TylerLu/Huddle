import { IssueMetric } from './issueMetric';
import { ReasonMetric } from './reasonMetric';
import { WeekDay } from './weekDay';
import { Issue } from './issue';

export class WeekInputViewModel {
    readonly inputLength: number = 7;
    weekDay: WeekDay;
    isIssueMetric: boolean;
    issueMetricArray = new Array<IssueMetric>();
    reasonMetricArray = new Array<ReasonMetric>();
    constructor() {
        for (let i = 0; i < this.inputLength; i++){
            this.issueMetricArray.push(new IssueMetric());
            this.reasonMetricArray.push(new ReasonMetric());
        }
    }
    public resetIssue(issue: Issue) {
        this.issueMetricArray.forEach(issueMetric => {
            issueMetric.issue = issue;
        });
    }
}