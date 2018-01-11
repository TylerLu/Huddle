import { Issue } from '../shared/models/issue';
import { Category } from '../shared/models/category';
import { Reason } from '../shared/models/reason';
import { IssueMetric } from '../shared/models/issueMetric';
import { ReasonMetric } from '../shared/models/reasonMetric';
import { DateHelper } from '../utils/dateHelper';

export class ModelConverter {

    public static ToReasonListBackend(reasons: Array<Reason>)
    {
        return reasons.map(reason => this.ToReasonBackend(reason));
    }

    public static ToReasonBackend(reason: Reason): any {        
        return {
            Id: reason.id,
            Issue: this.ToIssueBackend(reason.issue),
            Name: reason.name,
            State: reason.reasonState
        };
    }

    public static ToIssueBackend(issue: Issue): any {
        return {
            Id: issue.id,
            Name: issue.name,
            Metric: issue.metric,
            State: issue.issueState,
            TargetGoal: issue.targetGoal,
            Category: this.toCategoryBackend(issue.category),
            StartDate: issue.startDate
        };
    }

    public static toCategoryBackend(category: Category): any {
        return {
            Id: category==null?0:category.id,
            Name: category==null?'':category.name
        };
    }

    public static toIssueMetricBackend(issueMetric: IssueMetric) {
        return {
            Id: issueMetric.id,
            InputDate: DateHelper.LocalToUTC(issueMetric.inputDate),
            MetricValues: issueMetric.metricValues,
            Issue: this.ToIssueBackend(issueMetric.issue)
        };
    }

    public static toReasonMetricBackend(reasonMetric: ReasonMetric) {
        return {
            Id: reasonMetric.id,
            InputDate: DateHelper.LocalToUTC(reasonMetric.inputDate),
            ReasonMetricValues: reasonMetric.reasonMetricValues,
            Reason: this.ToReasonBackend(reasonMetric.reason)
        };
    }
}