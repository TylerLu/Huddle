import { Component, OnInit} from '@angular/core';

@Component({
    selector: 'tab',
    template: `<router-outlet></router-outlet>`
})

export class TeamTabComponent implements OnInit {

    constructor() {
    }

    ngOnInit(): void {

    }

}