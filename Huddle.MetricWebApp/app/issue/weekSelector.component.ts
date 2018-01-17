import { Component, OnInit,Input,Output, EventEmitter} from '@angular/core';
import { DateHelper } from '../utils/dateHelper';
import { AllowIssueClick } from '../shared/models/allowIssueClick';
import { WeekDay } from '../shared/models/weekDay';
import { WeekSelectorService } from '../services/weekSelector.service';

@Component({
    templateUrl: './weekSelector.component.html',
    selector: 'week-selector',
    styleUrls: ['./weekSelector.component.css', '../shared/shared.css']
})

export class WeekSelectorComponent implements OnInit {

    weekDisplay: string;
    //@Output() selectWeek: EventEmitter<WeekDay> = new EventEmitter<WeekDay>();
    @Input('allowClick') allowClick: AllowIssueClick;
    @Output() afterCheckAllowClick: EventEmitter<boolean> = new EventEmitter<boolean>();

    clickPrevious: boolean;
    clickNext: boolean;

    datesIntervalStr: string;

    constructor(private weekSelectorService: WeekSelectorService) {
    }
    ngOnInit(): void {
        this.datesIntervalStr = DateHelper.getDatesIntervalStr(this.currentWeek());
        this.subscribeWeekSelector();
    }

    subscribeWeekSelector() {
        this.weekSelectorService.selectWeek.subscribe(weekDay => {
            this.datesIntervalStr = DateHelper.getDatesIntervalStr(this.currentWeek());
        });
    }

    currentWeek(): WeekDay{
        return this.weekSelectorService.getCurrentWeek();
    }

    clickPreviousWeek() {
        this.clickPrevious = true;
        this.afterCheckAllowClick.emit(false);
        if (!this.allowClick.allowClick)
            return;
        this.weekSelectorService.gotoPreviousWeek();
    }

    clickNextWeek(): void{
        this.clickNext = true;
        this.afterCheckAllowClick.emit(false);
        if (!this.allowClick.allowClick)
            return;
        this.weekSelectorService.gotoNextWeek();
    }

    changeWeek() {
        
    }
}