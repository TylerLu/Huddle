import { Component, OnInit,AfterViewChecked } from "@angular/core"
import { FabricHelper } from './utils/fabricHelper';

@Component({
    selector: "app-root",
    templateUrl: './app.component.html',
    styleUrls:['./app.component.css']
})

export class AppComponent implements OnInit {

    isIssueListVisible: Boolean = true;

    ngOnInit() {
        this.hideIssueListForTeamTab();
    }

    hideIssueListForTeamTab() {
        if (location.pathname.indexOf('tab') >=0 )
            this.isIssueListVisible = false;
    }

    componentActivated(component: Component) {
        FabricHelper.init();
    }

    ngAfterViewChecked(): void {
        FabricHelper.initToggle();
    }

    componentDeactived(component: Component) {

    }

    
    

}