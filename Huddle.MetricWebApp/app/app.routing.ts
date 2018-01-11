import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddIssueComponent } from './issue/addIssue.component'
import { MetricIssueComponent } from './issue/metricIssue.component'
import { TeamTabComponent} from './teamTab/teamTab.component'
import { TeamTabConfigureComponent } from './teamTab/teamTab.configure.component'
import { TeamTabSignInComponent } from './teamTab/teamTab.signIn.component'
import { TeamTabSignInCallBackComponent } from './teamTab/teamTab.signIn.callback.component'
import { TeamTabPrivacyComponent} from './teamTab/teamTab.privacy.component';
import { TeamTabTermsComponent } from './teamTab/teamTab.terms.component';



const appRoutes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: MetricIssueComponent},
    { path: 'add-issue', component: AddIssueComponent },
    { path: 'metric-issue/:id', component: MetricIssueComponent },
    {
        path: 'tab', component: TeamTabComponent,
        children: [
            { path: '', redirectTo: 'configure', pathMatch: 'full' },
            { path: 'configure', component: TeamTabConfigureComponent},
            { path: 'sign-in', component: TeamTabSignInComponent},
            { path: 'sign-in-callback', component: TeamTabSignInCallBackComponent},
            { path: 'privacy', component: TeamTabPrivacyComponent },
            { path: 'termsofuse', component: TeamTabTermsComponent },
        ]
    },
];

export const routing: ModuleWithProviders =
    RouterModule.forRoot(appRoutes);