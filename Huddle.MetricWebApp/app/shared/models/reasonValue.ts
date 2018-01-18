import { Reason } from './reason';

export class ReasonValue {
    id?: number;
    reason?: Reason;
    reasonMetricValues?: number;
    inputDate?: Date;
    isUpdated?: boolean = false;
}