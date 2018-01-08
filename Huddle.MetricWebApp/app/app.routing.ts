import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IssueListComponent } from './issueList/issueList.component';
import { MetricIssueComponent } from './issue/metricIssue.component';



const appRoutes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: IssueListComponent},
    { path: 'issueList', component: IssueListComponent},
    //{ path: 'add-issue', component: AddIssueComponent },
    //{ path: 'metric-issue/:id', component: MetricIssueComponent },
];

export const routing: ModuleWithProviders =
    RouterModule.forRoot(appRoutes);