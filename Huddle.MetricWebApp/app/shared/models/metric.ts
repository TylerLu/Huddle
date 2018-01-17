import { Issue } from './issue';
import { State } from './state';
import { QueryResult } from './queryResult';

export class Metric implements QueryResult{
    id?: number;
    name?: string;
    issue?: Issue;
    targetGoal?: string;
    valueType?: string;
    metricState?: State;
    startDate?: Date;
}