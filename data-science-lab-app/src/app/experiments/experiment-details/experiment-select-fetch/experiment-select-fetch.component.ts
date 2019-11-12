import { Component, OnInit, OnDestroy } from '@angular/core';
import { FetchSessionService } from '../../../services';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';


@Component({
    selector: 'app-experiment-select-fetch',
    templateUrl: './experiment-select-fetch.component.html',
    styleUrls: []
})
export class ExperimentSelectFetchComponent implements OnInit, OnDestroy {

    experimentId: number;

    constructor(private fetchSessionService: FetchSessionService,
                private route: ActivatedRoute,
                private router: Router) {

    }

    ngOnInit() {
        this.route.parent.params
            .pipe(untilComponentDestroyed(this))
            .subscribe((params: Params) => {
                this.experimentId = +params.id;
            });
        this.fetchSessionService.newSession
            .pipe(untilComponentDestroyed(this))
            .subscribe((session) => {
                if (session.experimentId === this.experimentId) {
                    this.router.navigate(['/experiments', 'details', this.experimentId, 'setup-fetch']);
                }
            });
            
    }

    ngOnDestroy(): void {

    }

}
