import { Issue } from '../shared/models/issue';
import { MetricItem} from '../shared/models/metricItem';

export class IssueViewModel {
    Issue?: Issue;
    IsSelected?: Boolean;
    IssueState?: string;
    Expanded?: Boolean;
    MetricItemArray = new Array<MetricItem>();
}