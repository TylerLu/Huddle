import { Component, OnInit, AfterViewChecked, ViewChild, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Issue } from '../shared/models/issue';
import { IssueState } from '../shared/models/issueState';
import { Category } from '../shared/models/category';
import { Reason } from '../shared/models/reason';
import { AllowIssueClick } from '../shared/models/allowIssueClick';
import { IssueService } from '../services/issue.service';
import { ReasonService } from '../services/reason.service';
import { Constants } from '../shared/constants';
import { CommonUtil } from '../utils/commonUtil';
import { IssueListComponent } from '../issueList/issueList.component';
import { FabricHelper } from '../utils/fabricHelper';
declare var fabric: any;
declare var jQuery: any;

@Component({
    templateUrl: 'app/issue/addIssue.component.html',
    selector: 'add-issue',
    styleUrls: ['app/issue/addIssue.component.css', 'app/shared/shared.css']
})

export class AddIssueComponent implements OnInit, AfterViewChecked {
    @Output() afterAddedIssue: EventEmitter<Issue> = new EventEmitter<Issue>();

    selectedCategory = '';
    categories = new Array<Category>();
    toAddIssue = new Issue();
    toAddReasons = new Array<Reason>();
    isSaving = false;
    teamId = '1';
    isShown = false;

    constructor(private issueService: IssueService, private reasonService: ReasonService, private router: Router) {
    }

    ngOnInit(): void {
        if (CommonUtil.isInMsTeam()) {
            this.initTeamContext();
        } else {
            this.initCategoriesAndReasons();
        }
    }

    open(): void {
        jQuery("div.add-issue-dialog").find("li.ms-Dropdown-item").removeClass('is-selected');
        jQuery("div.add-issue-dialog").find('span.ms-Dropdown-title').html('');
        
        this.toAddIssue = new Issue();
        this.initCategoriesAndReasons();
        this.isShown = true;
    }

    close(): void {
        this.isShown = false;
        this.isSaving = false;
    }

    initCategoriesAndReasons() {
        this.initFourReasons();
        this.issueService.getCategories()
            .subscribe(resp => {
                this.categories = resp;
                if (this.categories.length > 0) {
                    this.selectedCategory = this.categories[0].name;
                    if (jQuery("li.ms-Dropdown-item").length > 0)
                        jQuery("div.add-issue-dialog").find("li.ms-Dropdown-item").first().addClass('is-selected');
                    jQuery("div.add-issue-dialog").find('span.ms-Dropdown-title').html(this.selectedCategory);
                }
                this.toAddIssue.category = this.getCategoryByName(this.selectedCategory);
            });
    }

    initTeamContext() {
        this.teamId = CommonUtil.getTeamId();
        this.initCategoriesAndReasons();
    }

    initFourReasons() {
        this.toAddReasons = new Array<Reason>();
        for (let i = 0; i < 4; i++) {
            let reason = new Reason();
            reason.issue = this.toAddIssue;
            this.toAddReasons.push(reason);
        }
    }

    selectCategory(categoryName) {
        let selectedCateoryName = jQuery("div.add-issue-dialog").find("li.ms-Dropdown-item").filter(function () { return jQuery(this).hasClass('is-selected'); }).html();
        this.selectedCategory = selectedCateoryName;
    }

    getCategoryByName(categoryName: string) {
         let filterResult = this.categories.filter(category => category.name == categoryName);
         if (filterResult.length > 0)
             return filterResult[0];
         return new Category(-1, '');
    }

    isSaveDisabled(): boolean {
        return !this.toAddIssue.name || !this.toAddIssue.metric || this.isSaving; 
    }

    saveIssue(): void {
        if (this.isSaveDisabled() == true)
            return;
        this.isSaving = true;
        this.toAddIssue.category = this.getCategoryByName(this.selectedCategory);
        let reasons = [];
        this.toAddReasons.forEach(reason => {
            if (reason.name)
                reasons.push(reason);
        });
        this.issueService.addIssue(this.toAddIssue, reasons, this.teamId)
            .subscribe(result => {
                if (result && result > 0) {
                    this.toAddIssue.id = result;
                    this.afterAddedIssue.emit(this.toAddIssue);
                    this.close();
                }
            });
    }

    ngAfterViewChecked() {
        FabricHelper.initFabricDropdown();
    }
}
