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
var weekInputViewModel_1 = require("../shared/models/weekInputViewModel");
var WeekInputComponent = /** @class */ (function () {
    function WeekInputComponent() {
    }
    WeekInputComponent.prototype.ngOnInit = function () {
    };
    __decorate([
        core_1.Input('currentWeekDays'),
        __metadata("design:type", Array)
    ], WeekInputComponent.prototype, "currentWeekDays", void 0);
    __decorate([
        core_1.Input('rowIndex'),
        __metadata("design:type", Number)
    ], WeekInputComponent.prototype, "rowIndex", void 0);
    __decorate([
        core_1.Input('weekInputViewModel'),
        __metadata("design:type", weekInputViewModel_1.WeekInputViewModel)
    ], WeekInputComponent.prototype, "weekInputViewModel", void 0);
    WeekInputComponent = __decorate([
        core_1.Component({
            templateUrl: 'app/issue/weekInput.component.html',
            selector: 'week-input',
            styleUrls: ['app/issue/weekInput.component.css', 'app/shared/shared.css']
        }),
        __metadata("design:paramtypes", [])
    ], WeekInputComponent);
    return WeekInputComponent;
}());
exports.WeekInputComponent = WeekInputComponent;
//# sourceMappingURL=weekInput.component.js.map