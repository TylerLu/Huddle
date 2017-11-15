import { Issue } from './issue';

export class IssueMetric {
    id?: number;
    issue?: Issue;
    metricValues?: number;
    inputDate?: Date;
}