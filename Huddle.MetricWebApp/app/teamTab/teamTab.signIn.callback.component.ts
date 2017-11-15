import { Component, OnInit, AfterViewChecked } from '@angular/core';
declare var microsoftTeams: any;

@Component({
    selector: 'tab-signin-callback',
    template: `callback`
})

export class TeamTabSignInCallBackComponent implements OnInit {

    constructor() {
    }

    ngOnInit(): void {
        microsoftTeams.initialize();
        microsoftTeams.authentication.notifySuccess();
    }
}