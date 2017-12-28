import { Issue } from './issue';
import { State } from './state';
import { Reason} from './reason';

export class MetricItem{
    id?: number;
    name?: string;
    issue?: Issue;
    reasonState?: State;
    startDate?: Date;
    isEditable?: boolean;
    ReasonArray = new Array<Reason>();
}