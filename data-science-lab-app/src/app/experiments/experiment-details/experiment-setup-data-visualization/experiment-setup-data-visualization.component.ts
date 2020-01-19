import { Component, OnInit, OnDestroy } from '@angular/core';
import { VisualizationDataSessionService } from '../../../services';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { VisualizationSessionViewModel } from '../../../../../shared/view-models';

@Component({
    selector: 'app-experiment-setup-data-visualization',
    templateUrl: './experiment-setup-data-visualization.component.html',
    styleUrls: []
})
export class ExperimentSetupDataVisualizationComponent implements OnInit, OnDestroy {

    experimentId: number;
    session: VisualizationSessionViewModel;

    constructor(private visualizationSessionService: VisualizationDataSessionService,
                private route: ActivatedRoute,
                private router: Router) {

    }


    ngOnInit() {
        this.route.parent.params
            .pipe(untilComponentDestroyed(this))
            .subscribe((params: Params) => {
                this.experimentId = +params.id;
            });

        this.route.params
            .pipe(untilComponentDestroyed(this))
            .subscribe((params: Params) => {
                const dataGroupId = +params.dataGroupId;
                this.session = this.visualizationSessionService.get(dataGroupId); 
            });

        this.visualizationSessionService.sessionUpdated
            .pipe(untilComponentDestroyed(this))
            .subscribe((session: VisualizationSessionViewModel) => {
                if (session.id === this.session.id) {
                    this.session = session;
                }
            });

        this.visualizationSessionService.sessionDeleted
            .pipe(untilComponentDestroyed(this))
            .subscribe((id: number) => {
                if (this.session.id === id) {
                    this.router.navigate(['/experiments', 'details', this.experimentId, 'data-workspace']);
                }
            });
            
        this.visualizationSessionService.sessionFinished
            .pipe(untilComponentDestroyed(this))
            .subscribe((id: number) => {
                if (this.session.id === id) {
                    this.router.navigate(['/experiments', 'details', this.experimentId, 'data-workspace']);
                }
            });

    }

    ngOnDestroy() {

    }

    onSubmit(inputs: {[id: string]: any}) {
        this.visualizationSessionService.submitOptions(this.session.id, inputs);
    }

    onExecuteCommand(cmd: string) {
        this.visualizationSessionService.executeCommand(this.session.id, cmd);
    }

    onQuit() {
        this.visualizationSessionService.delete(this.session.id);
    }

}

