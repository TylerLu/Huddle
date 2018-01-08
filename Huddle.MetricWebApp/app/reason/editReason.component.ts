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


@Component({
    templateUrl: 'app/reason/editReason.component.html',
    selector: 'edit-reason',
    styleUrls: ['app/reason/editReason.component.css', 'app/shared/shared.css']
})

export class EditReasonComponent implements OnInit, AfterViewChecked {
    @Input() relatedMetric: Metric;
    @Output() onClosed: EventEmitter<Reason> = new EventEmitter<Reason>();
    toEditReason = new Reason();


    
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
       // this.clearData();
        //this.isShown = false;
        //this.isSaving = false;
        this.onClosed.emit(this.toEditReason);
    }

    setToTrackingFrequency(value): void {
        this.toEditReason.trackingFrequency = value;
    }

    setToValueType(value):void{
        this.toEditReason.valueType = value;
    }


    saveReason(): void {
        this.toEditReason.reasonState = (this.toEditReason.reasonState.toLocaleString() === 'false' ? State.closed : State.active);
        //this.isSaving = true;
        this.reasonService.editReason(this.toEditReason).subscribe(result => {
            if (result && result > 0) {              
                this.close();
            }
        });
    }
    ngAfterViewChecked() {
        //FabricHelper.initFabricDropdown();
    }
}
