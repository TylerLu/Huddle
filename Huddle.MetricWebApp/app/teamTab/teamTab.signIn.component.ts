import { Component, OnInit, AfterViewChecked } from '@angular/core';
declare var microsoftTeams: any;

@Component({
    selector: 'tab-signIn',
    templateUrl: './teamTab.signIn.component.html',
})

export class TeamTabSignInComponent implements OnInit {

    constructor() {
    }

    ngOnInit(): void {

    }

    signIn(): void {
        microsoftTeams.getContext(function (context) {
            microsoftTeams.authentication.authenticate({
                url: '@authUrl' + '&loginHint=' + context.upn,
                width: 600,
                height: 480,
                successCallback: function () {
                    window.location.href = '/'
                },
                failureCallback: function () {
                    alert("Sign failed");
                }
            });
        });
    }
}