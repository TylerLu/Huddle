import { NgModule } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';
import { CookieModule } from 'ngx-cookie';
import { HttpModule } from '@angular/http';
import { routing } from './app.routing';
import { IssueListComponent } from './issueList/issueList.component';
import { HeaderComponent } from './header/header.component';
import { AddIssueComponent } from './issue/addIssue.component';
import { MetricIssueComponent } from './issue/metricIssue.component';
import { WeekSelectorComponent } from './issue/weekSelector.component';
import { WeekInputComponent } from './issue/weekInput.component';
import { AddReasonComponent } from './issue/addReason.component';
import { InputPopupComponent } from './issue/input.popup.component';
import { TeamTabComponent } from './teamTab/teamTab.component';
import { TeamTabConfigureComponent } from './teamTab/teamTab.configure.component';
import { TeamTabSignInComponent } from './teamTab/teamTab.signIn.component';
import { TeamTabSignInCallBackComponent } from './teamTab/teamTab.signIn.callback.component';
import { TeamTabPrivacyComponent} from './teamTab/teamTab.privacy.component';
import { TeamTabTermsComponent } from './teamTab/teamTab.terms.component';

import { CookieService } from "./services/cookie.service";
import { DataService } from "./services/data.service";
import { IssueService } from "./services/issue.service";
import { ReasonService } from "./services/reason.service";
import { MetricValueService } from "./services/metricValue.service";

@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        FormsModule,
        HttpModule,
        routing,
        Ng2Bs3ModalModule,
        CookieModule.forRoot()],
    declarations: [
        AppComponent,
        IssueListComponent,
        HeaderComponent,
        AddIssueComponent,
        MetricIssueComponent,
        WeekInputComponent,
        WeekSelectorComponent,
        AddReasonComponent,
        InputPopupComponent,
        TeamTabComponent,
        TeamTabConfigureComponent,
        TeamTabSignInComponent,
        TeamTabSignInCallBackComponent,
        TeamTabPrivacyComponent,
        TeamTabTermsComponent
    ],
    providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        CookieService,
        DataService,
        IssueService,
        ReasonService,
        MetricValueService
    ],
    bootstrap: [AppComponent]

})
export class AppModule { } 
