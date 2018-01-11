"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var dateHelper_1 = require("../utils/dateHelper");
var allowIssueClick_1 = require("../shared/models/allowIssueClick");
var WeekSelectorComponent = /** @class */ (function () {
    function WeekSelectorComponent() {
        this.selectWeek = new core_1.EventEmitter();
        this.afterCheckAllowClick = new core_1.EventEmitter();
    }
    WeekSelectorComponent.prototype.ngOnInit = function () {
        this.currentWeek = dateHelper_1.DateHelper.getStartAndEndDayOfWeek();
        this.datesIntervalStr = dateHelper_1.DateHelper.getDatesIntervalStr(this.currentWeek);
        this.selectWeek.emit(this.currentWeek);
        this.resetClickState();
    };
    WeekSelectorComponent.prototype.clickPreviousWeek = function () {
        this.clickPrevious = true;
        this.afterCheckAllowClick.emit(false);
        if (!this.allowClick.allowClick)
            return;
        this.gotoPreviousWeek();
    };
    WeekSelectorComponent.prototype.clickNextWeek = function () {
        this.clickNext = true;
        this.afterCheckAllowClick.emit(false);
        if (!this.allowClick.allowClick)
            return;
        this.gotoNextWeek();
    };
    WeekSelectorComponent.prototype.changeWeek = function () {
        if (this.clickNext == true)
            this.gotoNextWeek();
        if (this.clickPrevious == true)
            this.gotoPreviousWeek();
    };
    WeekSelectorComponent.prototype.gotoPreviousWeek = function () {
        var dayBeforeWeek = this.currentWeek.startDay.setDate(this.currentWeek.startDay.getDate() - 2);
        this.currentWeek = dateHelper_1.DateHelper.getStartAndEndDayOfWeek(new Date(dayBeforeWeek));
        this.datesIntervalStr = dateHelper_1.DateHelper.getDatesIntervalStr(this.currentWeek);
        this.selectWeek.emit(this.currentWeek);
        this.resetClickState();
    };
    WeekSelectorComponent.prototype.gotoNextWeek = function () {
        var dayAfterWeek = this.currentWeek.endDay.setDate(this.currentWeek.endDay.getDate() + 1);
        this.currentWeek = dateHelper_1.DateHelper.getStartAndEndDayOfWeek(new Date(dayAfterWeek));
        this.datesIntervalStr = dateHelper_1.DateHelper.getDatesIntervalStr(this.currentWeek);
        this.selectWeek.emit(this.currentWeek);
        this.resetClickState();
    };
    WeekSelectorComponent.prototype.resetClickState = function () {
        this.clickNext = false;
        this.clickPrevious = false;
    };
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], WeekSelectorComponent.prototype, "selectWeek", void 0);
    __decorate([
        core_1.Input('allowClick'),
        __metadata("design:type", allowIssueClick_1.AllowIssueClick)
    ], WeekSelectorComponent.prototype, "allowClick", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], WeekSelectorComponent.prototype, "afterCheckAllowClick", void 0);
    WeekSelectorComponent = __decorate([
        core_1.Component({
            templateUrl: 'app/issue/weekSelector.component.html',
            selector: 'week-selector',
            styleUrls: ['app/issue/weekSelector.component.css', 'app/shared/shared.css']
        }),
        __metadata("design:paramtypes", [])
    ], WeekSelectorComponent);
    return WeekSelectorComponent;
}());
exports.WeekSelectorComponent = WeekSelectorComponent;
//# sourceMappingURL=weekSelector.component.js.map