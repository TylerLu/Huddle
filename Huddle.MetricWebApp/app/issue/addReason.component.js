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
var issue_1 = require("../shared/models/issue");
var reason_1 = require("../shared/models/reason");
var state_1 = require("../shared/models/state");
var issue_service_1 = require("../services/issue.service");
var reason_service_1 = require("../services/reason.service");
var AddReasonComponent = (function () {
    function AddReasonComponent(issueService, reasonService) {
        this.issueService = issueService;
        this.reasonService = reasonService;
        this.afterAddedReason = new core_1.EventEmitter();
    }
    AddReasonComponent.prototype.ngOnInit = function () {
        if (this.toAddReason == null)
            this.toAddReason = new reason_1.Reason();
        this.toAddReason.reasonState = state_1.State.active;
        this.dialog = new fabric['Dialog'](jQuery('add-reason').find('.ms-Dialog').get(0));
    };
    AddReasonComponent.prototype.saveReason = function () {
        var _this = this;
        this.toAddReason.issue = this.currentIssue;
        this.reasonService.addReason(this.toAddReason)
            .subscribe(function (resp) {
            _this.toAddReason.id = resp;
            _this.afterAddedReason.emit(_this.toAddReason);
        });
    };
    AddReasonComponent.prototype.openDialog = function () {
        this.dialog.open();
    };
    AddReasonComponent.prototype.cancelReason = function () {
        this.dialog.close();
    };
    return AddReasonComponent;
}());
__decorate([
    core_1.Input('toAddReason'),
    __metadata("design:type", reason_1.Reason)
], AddReasonComponent.prototype, "toAddReason", void 0);
__decorate([
    core_1.Input('currentIssue'),
    __metadata("design:type", issue_1.Issue)
], AddReasonComponent.prototype, "currentIssue", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], AddReasonComponent.prototype, "afterAddedReason", void 0);
AddReasonComponent = __decorate([
    core_1.Component({
        templateUrl: 'app/issue/addReason.component.html',
        selector: 'add-reason',
        styleUrls: ['app/issue/addReason.component.css', 'app/shared/shared.css']
    }),
    __metadata("design:paramtypes", [issue_service_1.IssueService, reason_service_1.ReasonService])
], AddReasonComponent);
exports.AddReasonComponent = AddReasonComponent;
//# sourceMappingURL=addReason.component.js.map