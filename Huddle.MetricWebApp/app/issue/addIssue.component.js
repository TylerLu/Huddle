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
var router_1 = require("@angular/router");
var issue_1 = require("../shared/models/issue");
var category_1 = require("../shared/models/category");
var reason_1 = require("../shared/models/reason");
var issue_service_1 = require("../services/issue.service");
var reason_service_1 = require("../services/reason.service");
var commonUtil_1 = require("../utils/commonUtil");
var fabricHelper_1 = require("../utils/fabricHelper");
var AddIssueComponent = /** @class */ (function () {
    function AddIssueComponent(issueService, reasonService, router) {
        this.issueService = issueService;
        this.reasonService = reasonService;
        this.router = router;
        this.afterAddedIssue = new core_1.EventEmitter();
        this.selectedCategory = '';
        this.categories = new Array();
        this.toAddIssue = new issue_1.Issue();
        this.toAddReasons = new Array();
        this.isSaving = false;
        this.teamId = '1';
        this.isShown = false;
    }
    AddIssueComponent.prototype.ngOnInit = function () {
        if (commonUtil_1.CommonUtil.isInMsTeam()) {
            this.initTeamContext();
        }
        else {
            this.initCategoriesAndReasons();
        }
    };
    AddIssueComponent.prototype.open = function () {
        jQuery("div.add-issue-dialog").find("li.ms-Dropdown-item").removeClass('is-selected');
        jQuery("div.add-issue-dialog").find('span.ms-Dropdown-title').html('');
        this.toAddIssue = new issue_1.Issue();
        this.initCategoriesAndReasons();
        this.isShown = true;
    };
    AddIssueComponent.prototype.close = function () {
        this.isShown = false;
        this.isSaving = false;
    };
    AddIssueComponent.prototype.initCategoriesAndReasons = function () {
        var _this = this;
        this.initFourReasons();
        this.issueService.getCategories()
            .subscribe(function (resp) {
            _this.categories = resp;
            if (_this.categories.length > 0) {
                _this.selectedCategory = _this.categories[0].name;
                if (jQuery("li.ms-Dropdown-item").length > 0)
                    jQuery("div.add-issue-dialog").find("li.ms-Dropdown-item").first().addClass('is-selected');
                jQuery("div.add-issue-dialog").find('span.ms-Dropdown-title').html(_this.selectedCategory);
            }
            _this.toAddIssue.category = _this.getCategoryByName(_this.selectedCategory);
        });
    };
    AddIssueComponent.prototype.initTeamContext = function () {
        this.teamId = commonUtil_1.CommonUtil.getTeamId();
        this.initCategoriesAndReasons();
    };
    AddIssueComponent.prototype.initFourReasons = function () {
        this.toAddReasons = new Array();
        for (var i = 0; i < 4; i++) {
            var reason = new reason_1.Reason();
            reason.issue = this.toAddIssue;
            this.toAddReasons.push(reason);
        }
    };
    AddIssueComponent.prototype.selectCategory = function (categoryName) {
        var selectedCateoryName = jQuery("div.add-issue-dialog").find("li.ms-Dropdown-item").filter(function () { return jQuery(this).hasClass('is-selected'); }).html();
        this.selectedCategory = selectedCateoryName;
    };
    AddIssueComponent.prototype.getCategoryByName = function (categoryName) {
        var filterResult = this.categories.filter(function (category) { return category.name == categoryName; });
        if (filterResult.length > 0)
            return filterResult[0];
        return new category_1.Category(-1, '');
    };
    AddIssueComponent.prototype.isSaveDisabled = function () {
        return !this.toAddIssue.name || !this.toAddIssue.metric || this.isSaving;
    };
    AddIssueComponent.prototype.saveIssue = function () {
        var _this = this;
        if (this.isSaveDisabled() == true)
            return;
        this.isSaving = true;
        this.toAddIssue.category = this.getCategoryByName(this.selectedCategory);
        var reasons = [];
        this.toAddReasons.forEach(function (reason) {
            if (reason.name)
                reasons.push(reason);
        });
        this.issueService.addIssue(this.toAddIssue, reasons, this.teamId)
            .subscribe(function (result) {
            if (result && result > 0) {
                _this.toAddIssue.id = result;
                _this.afterAddedIssue.emit(_this.toAddIssue);
                _this.close();
            }
        });
    };
    AddIssueComponent.prototype.ngAfterViewChecked = function () {
        fabricHelper_1.FabricHelper.initFabricDropdown();
    };
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], AddIssueComponent.prototype, "afterAddedIssue", void 0);
    AddIssueComponent = __decorate([
        core_1.Component({
            templateUrl: 'app/issue/addIssue.component.html',
            selector: 'add-issue',
            styleUrls: ['app/issue/addIssue.component.css', 'app/shared/shared.css']
        }),
        __metadata("design:paramtypes", [issue_service_1.IssueService, reason_service_1.ReasonService, router_1.Router])
    ], AddIssueComponent);
    return AddIssueComponent;
}());
exports.AddIssueComponent = AddIssueComponent;
//# sourceMappingURL=addIssue.component.js.map