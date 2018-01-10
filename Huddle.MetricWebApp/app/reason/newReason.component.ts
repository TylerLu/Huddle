import { Component, OnInit, AfterViewChecked, ViewChild, Output, EventEmitter, Input  } from '@angular/core';
import { Router } from '@angular/router';
import { Reason } from '../shared/models/reason';
import { Metric } from '../shared/models/metric';
import { ReasonService } from '../services/reason.service';
import { MetricService } from '../services/metric.service';
import { IssueService } from '../services/issue.service';
import { Constants } from '../shared/constants';
import { CommonUtil } from '../utils/commonUtil';


@Component({
    templateUrl: 'app/reason/newReason.component.html',
    selector: 'new-reason',
    styleUrls: ['app/reason/newReason.component.css', 'app/shared/shared.css']
})

export class NewReasonComponent implements OnInit, AfterViewChecked {
    @Input() relatedMetric: Metric;
    @Output() onClosed: EventEmitter<Reason> = new EventEmitter<Reason>();
    metricName = '';
    issueName: any;
    toAddReason = new Reason();
    isSaving = false;
    isShown = false;
    checked = false;
    
    constructor(private reasonService: ReasonService, private metricService: MetricService, private router: Router) {
    }

    ngOnInit(): void {
       
    }

    iniControls(): void {
        this.clearData();
        this.issueName = this.relatedMetric.issue.name;
        this.metricName = this.relatedMetric.name;
        this.toAddReason.metric = this.relatedMetric;
    }

    clearData(): void {
        this.toAddReason = new Reason();
    }


    close(): void {
        this.clearData();
        //this.isShown = false;
        //this.isSaving = false;
        this.onClosed.emit(this.toAddReason);
    }

    updateValueType(valueType): void {
        this.toAddReason.valueType = valueType;
    }
    updateTrackingFrequency(value): void {
        this.toAddReason.trackingFrequency = value;
    }


    saveReason(): void {
        this.isSaving = true;
        this.reasonService.addReason(this.toAddReason).subscribe(result => {
                this.close();
        });
    }
    ngAfterViewChecked() {
        //FabricHelper.initFabricDropdown();
    }
}
