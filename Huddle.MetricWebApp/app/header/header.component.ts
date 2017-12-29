import { Component, OnInit, Input } from '@angular/core';

@Component({
    templateUrl: 'app/header/header.component.html',
    selector: 'header',
    styleUrls: ['app/header/header.component.css', 'app/shared/shared.css']
})

export class HeaderComponent implements OnInit {
    @Input('displayTitle') displayTitle: string;
    constructor() {
    }
    ngOnInit(): void {
    }

}