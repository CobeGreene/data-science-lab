import { Component, NgZone, OnInit, OnDestroy } from '@angular/core';
import { FetchSessionService, VisualizationsService } from '../../../services';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

@Component({
    selector: 'app-experiment-data-workspace',
    templateUrl: './experiment-data-workspace.component.html',
    styleUrls: []
})
export class ExperimentDataWorkspaceComponent implements OnInit, OnDestroy {

    private experimentId: number;

    constructor(private fetchSessionService: FetchSessionService, 
                private route: ActivatedRoute,
                private router: Router,
                private visualizationService: VisualizationsService) {

    }

    ngOnInit() {
        this.route.parent.params
            .pipe(untilComponentDestroyed(this))
            .subscribe((params: Params) => {
                this.experimentId = +params.id;
            });
    }

    ngOnDestroy() {

    }

    onGetData() {
        if (this.fetchSessionService.hasSession(this.experimentId)) {
            this.router.navigate(['/experiments', 'details', this.experimentId, 'setup-fetch']);
        } else {
            this.router.navigate(['/experiments', 'details', this.experimentId, 'select-fetch']);
        }
    }

    
}
