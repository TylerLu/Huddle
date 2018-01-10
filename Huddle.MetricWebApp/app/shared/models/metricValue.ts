import { Metric } from './metric';

export class MetricValue {
    id?: number;
    metric?: Metric;
    metricValues?: number;
    inputDate?: Date;
}