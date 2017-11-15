export class Constants {

    static route = class {
        public static readonly addIssue = 'add-issue';
        public static readonly metricIssue= 'metric-issue';
    }

    static issueState = class{
        public static readonly unselectedIssueState = -1;
        public static readonly defaultIssueState = 1;
    }

    static webAPI = class {
        public static readonly userUrl = '/api/user';
        public static readonly issuesUrl= '/api/issues';
        public static readonly categoriesUrl = '/api/categories';
        public static readonly reasonsUrl= '/api/reasons';
        public static readonly metricValuesUrl = '/api/metricvalues';
        public static readonly issuesFilterUrl= '/api/issuesFilter';
    }
}

