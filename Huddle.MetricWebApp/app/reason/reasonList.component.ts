import { Component, OnInit, AfterViewChecked, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from '../services/cookie.service';
import { ReasonService } from '../services/reason.service';
import { MetricService } from '../services/metric.service';
import { Reason } from '../shared/models/reason';
import { Constants } from '../shared/constants';
import { FabricHelper } from '../utils/fabricHelper';
import { CommonUtil } from '../utils/commonUtil';
declare var microsoftTeams: any;
import { State, TrackFrequency } from '../shared/models/state';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { NewReasonComponent } from './newReason.component';
import { EditReasonComponent } from './editReason.component';
import { Metric } from '../shared/models/metric';

@Component({
    templateUrl: 'app/reason/reasonList.component.html',
    selector: 'reason-list',
    styleUrls: ['app/reason/reasonList.component.css', 'app/shared/shared.css']
})

export class ReasonListComponent implements OnInit {

    reasonsArray = new Array<Reason>();
    metricId = 1;
    reasonToEditId: number;

    ifHidden: boolean = true;
   
    reasonWeelyArray = [];
    reasonDailyArray = [];

    @ViewChild('modalAddReason')
    modalAddReason: ModalComponent;
    @ViewChild(NewReasonComponent)
    addReasonPopUp: NewReasonComponent;

    @ViewChild('modalEditReason')
    modalEditReason: EditReasonComponent;
    @ViewChild(EditReasonComponent)
    editReasonPopUp: EditReasonComponent;


    @Input('currentMetric') currentMetric:Metric; 
    constructor(private reasonService: ReasonService, private metricServics: MetricService, private router: Router, private activateRoute: ActivatedRoute, private cookieService: CookieService) {
    }

    ngOnInit(): void {
        //this.initReasons();
    }

    initReasons() {
        this.reasonService.getReasonsByMetric(this.currentMetric.id)
            .subscribe(reasons => {                
                this.filterReasons(reasons);
            });
       
    }

    filterReasons(reasons) {
        this.reasonDailyArray = [];
        this.reasonWeelyArray = [];
        for (var i = 0; i < reasons.length; i++) {
            if (reasons[i].trackingFrequency == TrackFrequency.daily) {
                this.reasonDailyArray.push(reasons[i]);
            } else {
                this.reasonWeelyArray.push(reasons[i]);
            }
        } 
    }


    //popup

    addReasonClick() {
        this.modalAddReason.open();
    }

    editReasonClick(id) {
        this.reasonToEditId = id;
        this.modalEditReason.open();
    }
    closed() {
    }

    dismissed() {
    }

    opened() {
        this.addReasonPopUp.iniControls();
    }

    editReasonOpened() {
        this.editReasonPopUp.iniControls(this.reasonToEditId);
    }

    //switch
    onSwitch(id: any) {
        this.reasonService.updateReasonStatus(id);
        for (var i = 0; i < this.reasonWeelyArray.length; i++) {
            if (this.reasonWeelyArray[i].id == id) {
                var reasonState = this.reasonWeelyArray[i].reasonState;
                if (reasonState == State.active)
                    this.reasonWeelyArray[i].reasonState = State.closed;
                else
                    this.reasonWeelyArray[i].reasonState = State.active;
            }
        } 
        for (var i = 0; i < this.reasonDailyArray.length; i++) {
            if (this.reasonDailyArray[i].id == id) {
                var reasonState = this.reasonDailyArray[i].reasonState;
                if (reasonState == State.active)
                    this.reasonDailyArray[i].reasonState = State.closed;
                else
                    this.reasonDailyArray[i].reasonState = State.active;
            }
        } 
    }


    show() {
        this.ifHidden = false;
        this.initReasons();
    }

    hide() {
        this.ifHidden = true;
    }

    afterCloseNewReason(toAddReason: Reason) {
        this.modalAddReason.close();
    }

    afterCloseEditReason(toAddReason: Reason) {
        this.modalEditReason.close();
    }

}
