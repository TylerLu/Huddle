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
var Rx_1 = require("rxjs/Rx");
var data_service_1 = require("../services/data.service");
var constants_1 = require("../shared/constants");
var modelConverter_1 = require("../utils/modelConverter");
var dateHelper_1 = require("../utils/dateHelper");
var ReasonService = /** @class */ (function () {
    function ReasonService(dataService) {
        this.dataService = dataService;
    }
    ReasonService.prototype.addReason = function (reason) {
        var activeObject = new Rx_1.ReplaySubject(1);
        this.dataService.post(constants_1.Constants.webAPI.reasonsUrl, { reason: modelConverter_1.ModelConverter.ToReasonBackend(reason) })
            .subscribe(function (resp) {
            activeObject.next(resp.reasonId);
        }, function (error) { return activeObject.error(error); });
        return activeObject;
    };
    ReasonService.prototype.updateReasonState = function () {
    };
    ReasonService.prototype.getReasonsByIssue = function (issueId, state) {
        var _this = this;
        var activeObject = new Rx_1.ReplaySubject(1);
        this.dataService.getArray(constants_1.Constants.webAPI.reasonsUrl + "/" + issueId + "/" + state)
            .subscribe(function (resp) {
            var result = [];
            resp.forEach(function (reason, index) {
                reason.startDate = dateHelper_1.DateHelper.UTCToLocal(reason.startDate);
                reason.isEditable = false;
                result.push(reason);
            }, _this);
            activeObject.next(result);
        }, function (error) { activeObject.error(error); });
        return activeObject;
    };
    ReasonService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [data_service_1.DataService])
    ], ReasonService);
    return ReasonService;
}());
exports.ReasonService = ReasonService;
//# sourceMappingURL=reason.service.js.map