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
var InputPopupComponent = (function () {
    function InputPopupComponent() {
        this.afterClickOkay = new core_1.EventEmitter();
        this.afterConfirmOrCancel = new core_1.EventEmitter();
    }
    InputPopupComponent.prototype.ngOnInit = function () {
    };
    InputPopupComponent.prototype.clickOkay = function () {
        this.afterClickOkay.emit(true);
    };
    InputPopupComponent.prototype.clickConfirmOrCancel = function (isConfirm) {
        this.afterConfirmOrCancel.emit(isConfirm);
    };
    return InputPopupComponent;
}());
__decorate([
    core_1.Input('popUpTitle'),
    __metadata("design:type", String)
], InputPopupComponent.prototype, "inputTitle", void 0);
__decorate([
    core_1.Input('popUpTip'),
    __metadata("design:type", String)
], InputPopupComponent.prototype, "inputTip", void 0);
__decorate([
    core_1.Input('isConfirmInput'),
    __metadata("design:type", Boolean)
], InputPopupComponent.prototype, "isConfirmInput", void 0);
__decorate([
    core_1.Input("popupId"),
    __metadata("design:type", String)
], InputPopupComponent.prototype, "popupId", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], InputPopupComponent.prototype, "afterClickOkay", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], InputPopupComponent.prototype, "afterConfirmOrCancel", void 0);
InputPopupComponent = __decorate([
    core_1.Component({
        templateUrl: 'app/issue/input.popup.component.html',
        selector: 'input-popup',
        styleUrls: ['app/issue/input.popup.component.css', 'app/shared/shared.css']
    }),
    __metadata("design:paramtypes", [])
], InputPopupComponent);
exports.InputPopupComponent = InputPopupComponent;
//# sourceMappingURL=input.popup.component.js.map