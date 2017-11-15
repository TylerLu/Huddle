import { Component, OnInit, AfterViewChecked } from '@angular/core';
declare var microsoftTeams: any;

@Component({
    selector: 'tab-configure',
    template:``
})

export class TeamTabConfigureComponent implements OnInit {

    constructor() {
    }

    ngOnInit(): void {
        microsoftTeams.initialize();
        microsoftTeams.settings.setValidityState(true);
        microsoftTeams.settings.setSettings({
            entityId: "huddle",
            suggestedDisplayName: "Issues & Reasons",
            contentUrl: "https://" + window.location.hostname,
            websiteUrl: "https://" + window.location.hostname
        });
    }

}