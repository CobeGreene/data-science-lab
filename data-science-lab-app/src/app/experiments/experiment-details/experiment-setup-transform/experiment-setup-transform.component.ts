import { Component, OnInit, OnDestroy } from '@angular/core';
import { TransformSessionService } from '../../../services';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { TransformSessionViewModel } from '../../../../../shared/view-models';



@Component({
    selector: 'app-experiment-setup-transform',
    templateUrl: './experiment-setup-transform.component.html',
    styleUrls: []
})
export class ExperimentSetupTransformComponent implements OnInit, OnDestroy {

    experimentId: number;
    session: TransformSessionViewModel;

    constructor(private transformSessionService: TransformSessionService,
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
                this.session = this.transformSessionService.get(dataGroupId); 
            });

        this.transformSessionService.sessionUpdated
            .pipe(untilComponentDestroyed(this))
            .subscribe((session: TransformSessionViewModel) => {
                if (session.dataGroupId === this.session.dataGroupId) {
                    this.session = session;
                }
            });

        this.transformSessionService.sessionDeleted
            .pipe(untilComponentDestroyed(this))
            .subscribe((dataGroupId: number) => {
                if (this.session.dataGroupId === dataGroupId) {
                    this.router.navigate(['/experiments', 'details', this.experimentId, 'select-transfrom', this.session.dataGroupId]);
                }
            });
            
        this.transformSessionService.sessionFinished
            .pipe(untilComponentDestroyed(this))
            .subscribe((dataGroupId: number) => {
                if (this.session.dataGroupId === dataGroupId) {
                    this.router.navigate(['/experiments', 'details', this.experimentId, 'data-workspace']);
                }
            });

    }

    ngOnDestroy() {

    }

    onSubmit(inputs: {[id: string]: any}) {
        this.transformSessionService.submitOptions(this.session.dataGroupId, inputs);
    }

    onExecuteCommand(cmd: string) {
        this.transformSessionService.executeCommand(this.session.dataGroupId, cmd);
    }

}

