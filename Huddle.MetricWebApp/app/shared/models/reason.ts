import { Metric} from './metric';
import { State } from './state';
import { QueryResult } from './queryResult';

export class Reason implements QueryResult{
    id?: number;
    name?: string;
    metric?: Metric;
    reasonState?: State;
    startDate?: Date;
    isEditable?: boolean;
    reasonTracking?: string;
    valueType: string;
    trackingFrequency: string;
   
}