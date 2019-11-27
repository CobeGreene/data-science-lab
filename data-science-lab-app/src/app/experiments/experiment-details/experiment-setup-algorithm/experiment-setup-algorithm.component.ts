import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlgorithmSessionService } from '../../../services';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { AlgorithmSessionViewModel } from '../../../../../shared/view-models';



@Component({
    selector: 'app-experiment-setup-algorithm',
    templateUrl: './experiment-setup-algorithm.component.html',
    styleUrls: []
})
export class ExperimentSetupAlgorithmComponent implements OnInit, OnDestroy {

    experimentId: number;
    session: AlgorithmSessionViewModel;

    constructor(private sessionService: AlgorithmSessionService,
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
                this.session = this.sessionService.get(dataGroupId); 
            });

        this.sessionService.sessionUpdated
            .pipe(untilComponentDestroyed(this))
            .subscribe((session: AlgorithmSessionViewModel) => {
                if (session.dataGroupId === this.session.dataGroupId) {
                    this.session = session;
                }
            });

        this.sessionService.sessionDeleted
            .pipe(untilComponentDestroyed(this))
            .subscribe((dataGroupId: number) => {
                if (this.session.dataGroupId === dataGroupId) {
                    this.router.navigate(['/experiments', 'details', this.experimentId, 'algorithm-workspace']);
                }
            });
            
        this.sessionService.sessionFinished
            .pipe(untilComponentDestroyed(this))
            .subscribe((dataGroupId: number) => {
                if (this.session.dataGroupId === dataGroupId) {
                    this.router.navigate(['/experiments', 'details', this.experimentId, 'algorithm-workspace']);
                }
            });

    }

    ngOnDestroy() {

    }

    onSubmit(inputs: {[id: string]: any}) {
        this.sessionService.submitOptions(this.session.dataGroupId, inputs);
    }

    onExecuteCommand(cmd: string) {
        this.sessionService.executeCommand(this.session.dataGroupId, cmd);
    }

    onQuit() {
        this.sessionService.delete(this.session.dataGroupId);
    }

}

