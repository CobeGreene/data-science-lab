import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FetchSessionViewModel } from '../../../../../shared/view-models';
import { FetchSessionService } from '../../../services';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';


@Component({
    selector: 'app-experiment-setup-fetch',
    templateUrl: './experiment-setup-fetch.component.html',
    styleUrls: []
})
export class ExperimentSetupFetchComponent implements OnInit, OnDestroy {

    fetchSession: FetchSessionViewModel;

    constructor(private fetchSessionService: FetchSessionService,
                private route: ActivatedRoute,
                private router: Router) {

    }

    ngOnInit() {
        this.route.parent.params
            .pipe(untilComponentDestroyed(this))
            .subscribe((params: Params) => {
                const id = +params.id;
                this.fetchSession = this.fetchSessionService.get(id);
            });

        this.fetchSessionService.sessionUpdated
            .pipe(untilComponentDestroyed(this))
            .subscribe((session: FetchSessionViewModel) => {
                if (session.experimentId === this.fetchSession.experimentId) {
                    console.log('session update');
                    this.fetchSession = session;
                }
            });

        this.fetchSessionService.sessionDeleted
            .pipe(untilComponentDestroyed(this))
            .subscribe((experimentId: number) => {
                if (this.fetchSession.experimentId === experimentId) {
                    this.router.navigate(['/experiments', 'details', this.fetchSession.experimentId, 'select-fetch']);
                }
            });

        this.fetchSessionService.sessionFinished
            .pipe(untilComponentDestroyed(this))
            .subscribe((experimentId: number) => {
                if (this.fetchSession.experimentId === experimentId) {
                    this.router.navigate(['/experiments', 'details', this.fetchSession.experimentId, 'data-workspace']);
                }
            });

    }

    ngOnDestroy() {

    }

    onSubmit(inputs: { [id: string]: any }) {
        this.fetchSessionService.submitOptions(this.fetchSession.experimentId, inputs);
    }

    onExecuteCommand(cmd: string) {
        this.fetchSessionService.executeCommand(this.fetchSession.experimentId, cmd);
    }
}
