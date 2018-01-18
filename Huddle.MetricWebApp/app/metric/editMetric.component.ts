import { Component, OnInit, AfterViewChecked, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { FormControl, FormGroup, Validators, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Metric } from '../shared/models/metric';
import { MetricService } from '../services/metric.service';
import { Constants } from '../shared/constants';
import { IssueService } from '../services/issue.service';
import { Issue } from '../shared/models/issue';
import { State } from '../shared/models/state';
import { ConfirmComponent } from '../confirm/confirm.component';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';

@Component({
    templateUrl: './editMetric.component.html',
    selector: 'edit-metric',
    styleUrls: ['./editMetric.component.css', '../shared/shared.css']
})

export class EditMetricComponent implements OnInit, AfterViewChecked {
    @Output() afterAddedIssue: EventEmitter<Metric> = new EventEmitter<Metric>();
    @Output() onClosed: EventEmitter<Metric> = new EventEmitter<Metric>();
    @Output() onDeleted: EventEmitter<Metric> = new EventEmitter<Metric>();
    @Input() issueId: string;

    isSaving = false;
    isShown = false;
    toEditMetric = new Metric();
    issue = new Issue();
    @ViewChild('metricForm')
    private metricForm: NgForm;

    constructor(private metricService: MetricService, private issueService: IssueService, private router: Router) {
    }

    ngOnInit(): void {
    }

    open(issueId, metricId): void {
        this.isShown = true;
        this.isSaving = false;
        if (issueId>0) {
            this.issueService.getIssueById(issueId)
                .subscribe(issue => {
                    this.issue.id = issue.id;
                    this.issue.name = issue.name;
                    this.toEditMetric.issue = issue;
            });
        }
        if (metricId > 0) {
            this.metricService.getMetricById(metricId)
                .subscribe(metric => {
                    this.toEditMetric.id = metric.id;
                    this.toEditMetric.name = metric.name;
                    this.toEditMetric.valueType = metric.valueType;
                    this.toEditMetric.metricState = metric.metricState;
                    this.toEditMetric.targetGoal = metric.targetGoal;
            });
        }
    }

    close(): void {
        this.isShown = false;
        this.isSaving = false;
        this.onClosed.emit(this.toEditMetric);
    }

    updateValueType(valueType): void {
        this.toEditMetric.valueType = valueType;
    }


    saveMetric(): void {
        this.isSaving = true;
        this.toEditMetric.metricState = (this.toEditMetric.metricState.toLocaleString() === 'false' ? State.closed : State.active);

        this.metricService.editMetric(this.toEditMetric)
            .subscribe(result => {
                    this.close();
            });
    }

    //pop up

    @ViewChild(ConfirmComponent)
    private deletePopupComponent: ConfirmComponent;

    deleteTitle: string = '';


    @ViewChild('modalDelete')
    modalDeletePopupContainer: ModalComponent;

    delete(): void {
        this.modalDeletePopupContainer.open();5
    }
    deleteOpened(): void {
        this.deleteTitle = 'DELETE METRIC: "' + this.toEditMetric.name + '"';
        this.deletePopupComponent.open(Constants.metricListName, this.toEditMetric.id);
    }
    deleteDismissed(): void {
    }

    afterCloseDelete(closeParent): void {
        this.modalDeletePopupContainer.close();
        if (closeParent) {
            this.onDeleted.emit(this.toEditMetric);
            this.close();
        }
    }

    ngAfterViewChecked() {
        
    }
}
