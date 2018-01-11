import { Issue} from './issue';
import { State } from './state';

export class Reason{
    id?: number;
    name?: string;
    issue?: Issue;
    reasonState?: State;
    startDate?: Date;
    isEditable?: boolean;
}