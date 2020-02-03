import { Component, OnInit, OnDestroy } from '@angular/core';
import { VisualizationAlgorithmSessionService } from '../../../services';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { VisualizationSessionViewModel } from '../../../../../shared/view-models';

@Component({
    selector: 'app-experiment-setup-algorithm-visualization',
    templateUrl: './experiment-setup-algorithm-visualization.component.html',
    styleUrls: []
})
export class ExperimentSetupAlgorithmVisualizationComponent implements OnInit, OnDestroy {

    experimentId: number;
    session: VisualizationSessionViewModel;

    constructor(private visualizationSessionService: VisualizationAlgorithmSessionService,
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
                const id = +params.algorithmId;
                this.session = this.visualizationSessionService.get(id); 
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

