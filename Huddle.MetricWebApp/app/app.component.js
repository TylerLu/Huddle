"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var fabricHelper_1 = require("./utils/fabricHelper");
var AppComponent = (function () {
    function AppComponent() {
        this.isIssueListVisible = true;
    }
    AppComponent.prototype.ngOnInit = function () {
        this.hideIssueListForTeamTab();
    };
    AppComponent.prototype.hideIssueListForTeamTab = function () {
        if (location.pathname.indexOf('tab') >= 0)
            this.isIssueListVisible = false;
    };
    AppComponent.prototype.componentActivated = function (component) {
        fabricHelper_1.FabricHelper.init();
    };
    AppComponent.prototype.ngAfterViewChecked = function () {
        fabricHelper_1.FabricHelper.initToggle();
    };
    AppComponent.prototype.componentDeactived = function (component) {
    };
    return AppComponent;
}());
AppComponent = __decorate([
    core_1.Component({
        selector: "app-root",
        templateUrl: 'app/app.component.html',
        styleUrls: ['app/app.component.css']
    })
], AppComponent);
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map