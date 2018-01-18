import { Component, OnInit, AfterViewChecked, ViewChild, Output, EventEmitter, Input  } from '@angular/core';
import { Router } from '@angular/router';
import { Reason } from '../shared/models/reason';
import { Metric } from '../shared/models/metric';
import { ReasonService } from '../services/reason.service';
import { MetricService } from '../services/metric.service';
import { IssueService } from '../services/issue.service';
import { Constants } from '../shared/constants';
import { CommonUtil } from '../utils/commonUtil';
import { State } from '../shared/models/state';
import { FormControl, FormGroup, Validators, NgForm } from '@angular/forms';
import { ConfirmComponent } from '../confirm/confirm.component';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';


@Component({
    templateUrl: './editReason.component.html',
    selector: 'edit-reason',
    styleUrls: ['./editReason.component.css', '../shared/shared.css']
})

export class EditReasonComponent implements OnInit, AfterViewChecked {
    @Input() relatedMetric: Metric;
    @Output() onClosed: EventEmitter<Reason> = new EventEmitter<Reason>();
    toEditReason = new Reason();

    @ViewChild('reasonForm')
    private reasonForm: NgForm;
    
    constructor(private reasonService: ReasonService, private metricService: MetricService, private router: Router) {
    }

    ngOnInit(): void {
       
    }

    iniControls(reasonId): void {
        if (reasonId > 0) {
            this.reasonService.getReasonById(reasonId)
                .subscribe(reason => {
                    this.toEditReason.metric = this.relatedMetric;
                    this.toEditReason.id = reason.id;
                    this.toEditReason.name = reason.name;
                    this.toEditReason.reasonTracking = reason.reasonTracking;
                    this.toEditReason.trackingFrequency = reason.trackingFrequency;
                    this.toEditReason.valueType = reason.valueType;
                    this.toEditReason.reasonState = reason.reasonState;
                });
        }
    }

    clearData(): void {
        //this.toEditReason = new Reason();
    }

    open(): void {
       
    }

    close(): void {
        this.onClosed.emit(this.toEditReason);
    }




    saveReason(): void {
        this.toEditReason.reasonState = ((this.toEditReason.reasonState.toLocaleString() === 'false' || this.toEditReason.reasonState.toLocaleString() === '0' )? State.closed : State.active);
        this.reasonService.editReason(this.toEditReason).subscribe(result => {
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
        this.modalDeletePopupContainer.open(); 5
    }
    deleteOpened(): void {
        this.deleteTitle = 'DELETE REASON: "' + this.toEditReason.name + '"';
        this.deletePopupComponent.open(Constants.reasonListName, this.toEditReason.id);
    }
    deleteDismissed(): void {
    }

    afterCloseDelete(closeParent): void {
        this.modalDeletePopupContainer.close();
        if (closeParent) {
            this.close();
        }
    }

    ngAfterViewChecked() {
    }
}
