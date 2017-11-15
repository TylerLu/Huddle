"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var router_1 = require("@angular/router");
var addIssue_component_1 = require("./issue/addIssue.component");
var metricIssue_component_1 = require("./issue/metricIssue.component");
var teamTab_component_1 = require("./teamTab/teamTab.component");
var teamTab_configure_component_1 = require("./teamTab/teamTab.configure.component");
var teamTab_signIn_component_1 = require("./teamTab/teamTab.signIn.component");
var teamTab_signIn_callback_component_1 = require("./teamTab/teamTab.signIn.callback.component");
var teamTab_privacy_component_1 = require("./teamTab/teamTab.privacy.component");
var teamTab_terms_component_1 = require("./teamTab/teamTab.terms.component");
var appRoutes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: metricIssue_component_1.MetricIssueComponent },
    { path: 'add-issue', component: addIssue_component_1.AddIssueComponent },
    { path: 'metric-issue/:id', component: metricIssue_component_1.MetricIssueComponent },
    {
        path: 'tab', component: teamTab_component_1.TeamTabComponent,
        children: [
            { path: '', redirectTo: 'configure', pathMatch: 'full' },
            { path: 'configure', component: teamTab_configure_component_1.TeamTabConfigureComponent },
            { path: 'sign-in', component: teamTab_signIn_component_1.TeamTabSignInComponent },
            { path: 'sign-in-callback', component: teamTab_signIn_callback_component_1.TeamTabSignInCallBackComponent },
            { path: 'privacy', component: teamTab_privacy_component_1.TeamTabPrivacyComponent },
            { path: 'termsofuse', component: teamTab_terms_component_1.TeamTabTermsComponent },
        ]
    },
];
exports.routing = router_1.RouterModule.forRoot(appRoutes);
//# sourceMappingURL=app.routing.js.map