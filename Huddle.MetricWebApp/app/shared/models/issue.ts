import { Category } from './category';
import { State } from './state';
import { IssueState } from './issueState';

export class Issue {
    id?: number;
    name?: string;
    category?: Category;
    metric?: string;
    targetGoal?: string;
    //metricState?: State;
    issueState?:IssueState;
    startDate?: Date;
    isMetricEditable?: boolean;
    isNameEditable?: boolean;
}