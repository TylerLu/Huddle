import { Component, OnInit, AfterViewChecked, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Metric } from '../shared/models/metric';
import { MetricService } from '../services/metric.service';
import { Constants } from '../shared/constants';
import { IssueService } from '../services/issue.service';
import { Issue } from '../shared/models/issue';

@Component({
    templateUrl: 'app/metric/addMetric.component.html',
    selector: 'add-metric',
    styleUrls: ['app/metric/addMetric.component.css', 'app/shared/shared.css']
})

export class AddMetricComponent implements OnInit, AfterViewChecked {
    @Output() afterAddedIssue: EventEmitter<Metric> = new EventEmitter<Metric>();
    @Output() onClosed: EventEmitter<Metric> = new EventEmitter<Metric>();
    @Input() issueId: string;

    isSaving = false;
    isShown = false;
    toAddMetric = new Metric();
    issue = new Issue();

    constructor(private metricService: MetricService, private issueService: IssueService, private router: Router) {
    }

    ngOnInit(): void {
    }

    open(issueId): void {
        this.isShown = true;
        if (issueId>0) {
            this.issueService.getIssueById(issueId)
                .subscribe(issue => {
                    this.issue.id = issue.id;
                    this.issue.name = issue.name;
                    this.toAddMetric.issue = issue;
            });
        }
    }

    close(): void {
        this.isShown = false;
        this.isSaving = false;
        this.onClosed.emit(this.toAddMetric);
    }

    updateValueType(valueType): void {
        this.toAddMetric.valueType = valueType;
    }


    saveMetric(): void {
        this.isSaving = true;
        this.metricService.addMetric(this.toAddMetric)
            .subscribe(result => {
                    this.close();
            });
    }

    ngAfterViewChecked() {
        
    }
}
