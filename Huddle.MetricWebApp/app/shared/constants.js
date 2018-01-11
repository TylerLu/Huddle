"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Constants = /** @class */ (function () {
    function Constants() {
    }
    Constants.route = (_a = /** @class */ (function () {
            function class_1() {
            }
            return class_1;
        }()),
        _a.addIssue = 'add-issue',
        _a.metricIssue = 'metric-issue',
        _a);
    Constants.issueState = (_b = /** @class */ (function () {
            function class_2() {
            }
            return class_2;
        }()),
        _b.unselectedIssueState = -1,
        _b.defaultIssueState = 1,
        _b);
    Constants.webAPI = (_c = /** @class */ (function () {
            function class_3() {
            }
            return class_3;
        }()),
        _c.userUrl = '/api/user',
        _c.issuesUrl = '/api/issues',
        _c.categoriesUrl = '/api/categories',
        _c.reasonsUrl = '/api/reasons',
        _c.metricValuesUrl = '/api/metricvalues',
        _c.issuesFilterUrl = '/api/issuesFilter',
        _c);
    return Constants;
    var _a, _b, _c;
}());
exports.Constants = Constants;
//# sourceMappingURL=constants.js.map