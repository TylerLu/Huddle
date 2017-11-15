import { Component, OnInit, Input } from '@angular/core';
import { WeekDay } from '../shared/models/weekDay';
import { WeekInputViewModel } from '../shared/models/weekInputViewModel';
import { DateHelper } from '../utils/dateHelper';

@Component({
    templateUrl: 'app/issue/weekInput.component.html',
    selector: 'week-input',
    styleUrls: ['app/issue/weekInput.component.css', 'app/shared/shared.css']
})

export class WeekInputComponent implements OnInit {
    @Input('currentWeekDays') currentWeekDays: Array<Date>;
    @Input('rowIndex') rowIndex: number;
    @Input('weekInputViewModel') weekInputViewModel: WeekInputViewModel;
    constructor() {
    }
    ngOnInit(): void {
        
    }
}
