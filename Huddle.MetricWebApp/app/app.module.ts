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
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { UiSwitchModule } from 'ngx-ui-switch';
import { IssueListComponent } from './issueList/issueList.component';
import { HeaderComponent } from './header/header.component';
import { AddIssueComponent } from './issue/addIssue.component';
import { EditIssueComponent } from './issue/editIssue.component';
import { MetricIssueComponent } from './issue/metricIssue.component';
import { AddMetricComponent } from './metric/addMetric.component';
import { EditMetricComponent } from './metric/editMetric.component';
import { WeekSelectorComponent } from './issue/weekSelector.component';
import { WeekInputComponent } from './issue/weekInput.component';
import { AddReasonComponent } from './issue/addReason.component';
import { InputPopupComponent } from './issue/input.popup.component';
import { MetricListComponent } from './metric/metricList.component';
import { TeamTabComponent } from './teamTab/teamTab.component';
import { TeamTabConfigureComponent } from './teamTab/teamTab.configure.component';
import { TeamTabSignInComponent } from './teamTab/teamTab.signIn.component';
import { TeamTabSignInCallBackComponent } from './teamTab/teamTab.signIn.callback.component';
import { TeamTabPrivacyComponent} from './teamTab/teamTab.privacy.component';
import { TeamTabTermsComponent } from './teamTab/teamTab.terms.component';
import { ReasonListComponent } from './reason/reasonList.component';
import { NewReasonComponent } from './reason/newReason.component';
import { EditReasonComponent } from './reason/editReason.component';
import { CookieService } from "./services/cookie.service";
import { DataService } from "./services/data.service";
import { IssueService } from "./services/issue.service";
import { ReasonService } from "./services/reason.service";
import { MetricValueService } from "./services/metricValue.service";
import { QueryService } from "./services/query.service";
import { MetricService } from './services/metric.service';

@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        FormsModule,
        HttpModule,
        routing,
        Ng2Bs3ModalModule,
        NguiAutoCompleteModule,
        UiSwitchModule,
        CookieModule.forRoot()],
    declarations: [
        AppComponent,
        IssueListComponent,
        HeaderComponent,
        AddIssueComponent,
        EditIssueComponent,
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
        TeamTabTermsComponent,
        ReasonListComponent,
        NewReasonComponent,
        EditReasonComponent,
        MetricListComponent,
        AddMetricComponent,
        EditMetricComponent
    ],
    providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        CookieService,
        DataService,
        IssueService,
        ReasonService,
        MetricValueService,
        QueryService,
        MetricService
    ],
    bootstrap: [AppComponent]

})
export class AppModule { } 
