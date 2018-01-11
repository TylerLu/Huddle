import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { Issue } from '../shared/models/issue';
import { Reason} from '../shared/models/reason';
import { State } from '../shared/models/state';
import { IssueService } from '../services/issue.service';
import { ReasonService } from '../services/reason.service';
import { Constants } from '../shared/constants';
import { CommonUtil } from '../utils/commonUtil';
declare var jQuery: any;
declare var fabric: any;
@Component({
    templateUrl: 'app/issue/addReason.component.html',
    selector: 'add-reason',
    styleUrls: ['app/issue/addReason.component.css', 'app/shared/shared.css']
})

export class AddReasonComponent implements OnInit {

    @Input('toAddReason') toAddReason: Reason;
    @Input('currentIssue') currentIssue: Issue;
    @Output() afterAddedReason: EventEmitter<Reason> = new EventEmitter<Reason>();

    dialog: any;
    constructor(private issueService: IssueService, private reasonService: ReasonService) {
    }

    ngOnInit(): void {
        if (this.toAddReason==null)
            this.toAddReason = new Reason();
        this.toAddReason.reasonState = State.active;
        this.dialog = new fabric['Dialog'](jQuery('add-reason').find('.ms-Dialog').get(0));
    }

    

    saveReason(): void {
        this.toAddReason.issue = this.currentIssue;
        this.reasonService.addReason(this.toAddReason)
            .subscribe(resp => {
                this.toAddReason.id = resp;
                this.afterAddedReason.emit(this.toAddReason);
            });
    }

    openDialog() {
        this.dialog.open();
    }

    cancelReason(): void {
        this.dialog.close();
    }

}