export class Constants {

    static readonly suggestCharNum = 3;

    static teamId: string = "6adc71b5-8158-4002-b4c7-48b37c3acd5e";
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
        public static readonly reasonsUrl = '/api/reasons';
        public static readonly reasonStatusUrl = '/api/reasons/updatereasonstatus';
        public static readonly reasonsListUrl = 'api/reasons/reasonlist';
        public static readonly reasonEditUrl = 'api/reasons/editReason';
        public static readonly metricValuesUrl = '/api/metricvalues';
        public static readonly issuesFilterUrl= '/api/issuesFilter';
        public static readonly queryUrl = '/api/itemsquery';
        public static readonly metricUrl = '/api/metrics';
    }
}

