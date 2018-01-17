
import { QueryResult } from './queryResult';

export class User implements QueryResult {
    id?: number;
    name?: string;
    mail?: string;
}