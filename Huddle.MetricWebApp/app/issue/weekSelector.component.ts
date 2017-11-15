import { Component, OnInit,Input,Output, EventEmitter} from '@angular/core';
import { DateHelper } from '../utils/dateHelper';
import { AllowIssueClick } from '../shared/models/allowIssueClick';
import { WeekDay} from '../shared/models/weekDay';

@Component({
    templateUrl: 'app/issue/weekSelector.component.html',
    selector: 'week-selector',
    styleUrls: ['app/issue/weekSelector.component.css', 'app/shared/shared.css']
})

export class WeekSelectorComponent implements OnInit {

    currentWeek: WeekDay;
    weekDisplay: string;
    @Output() selectWeek: EventEmitter<WeekDay> = new EventEmitter<WeekDay>();
    @Input('allowClick') allowClick: AllowIssueClick;
    @Output() afterCheckAllowClick: EventEmitter<boolean> = new EventEmitter<boolean>();

    clickPrevious: boolean;
    clickNext: boolean;

    datesIntervalStr: string;

    constructor() {
    }
    ngOnInit(): void {
        this.currentWeek = DateHelper.getStartAndEndDayOfWeek();
        this.datesIntervalStr = DateHelper.getDatesIntervalStr(this.currentWeek);
        this.selectWeek.emit(this.currentWeek);
        this.resetClickState();
    }

    clickPreviousWeek() {
        this.clickPrevious = true;
        this.afterCheckAllowClick.emit(false);
        if (!this.allowClick.allowClick)
            return;
        this.gotoPreviousWeek();
    }

    clickNextWeek(): void{
        this.clickNext = true;
        this.afterCheckAllowClick.emit(false);
        if (!this.allowClick.allowClick)
            return;
        this.gotoNextWeek();
    }

    changeWeek() {
        if (this.clickNext == true)
            this.gotoNextWeek();
        if (this.clickPrevious == true)
            this.gotoPreviousWeek();
    }

    gotoPreviousWeek() {
        let dayBeforeWeek = this.currentWeek.startDay.setDate(this.currentWeek.startDay.getDate() - 2);
        this.currentWeek = DateHelper.getStartAndEndDayOfWeek(new Date(dayBeforeWeek));
        this.datesIntervalStr = DateHelper.getDatesIntervalStr(this.currentWeek);
        this.selectWeek.emit(this.currentWeek);
        this.resetClickState();
    }

    gotoNextWeek() {
        let dayAfterWeek = this.currentWeek.endDay.setDate(this.currentWeek.endDay.getDate() + 1);
        this.currentWeek = DateHelper.getStartAndEndDayOfWeek(new Date(dayAfterWeek));
        this.datesIntervalStr = DateHelper.getDatesIntervalStr(this.currentWeek);
        this.selectWeek.emit(this.currentWeek);
        this.resetClickState();
    }

    resetClickState() {
        this.clickNext = false;
        this.clickPrevious = false;
    }
}