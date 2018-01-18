import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { Issue } from '../shared/models/issue';
import { Reason } from '../shared/models/reason';
import { State } from '../shared/models/state';
import { IssueService } from '../services/issue.service';
import { ReasonService } from '../services/reason.service';
import { Constants } from '../shared/constants';
import { CommonUtil } from '../utils/commonUtil';

@Component({
    templateUrl: './input.popup.component.html',
    selector: 'input-popup',
    styleUrls: ['./input.popup.component.css', '../shared/shared.css']
})

export class InputPopupComponent implements OnInit {

    @Input('popUpTitle') inputTitle: string;
    @Input('popUpTip') inputTip: string;
    @Input('isConfirmInput') isConfirmInput: boolean;
    @Input("popupId") popupId: string;
    @Output() afterClickOkay: EventEmitter<boolean> = new EventEmitter();
    @Output() afterConfirmOrCancel: EventEmitter<boolean> = new EventEmitter<boolean>();
    constructor() {
    }

    ngOnInit(): void {
    }



    clickOkay(): void {
        this.afterClickOkay.emit(true);
    }

    clickConfirmOrCancel(isConfirm: boolean): void {
        this.afterConfirmOrCancel.emit(isConfirm);
    }


}