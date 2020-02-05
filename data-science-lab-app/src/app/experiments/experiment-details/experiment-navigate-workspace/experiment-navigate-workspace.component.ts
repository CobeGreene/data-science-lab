import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
    selector: 'app-experiment-navigate-workspace',
    templateUrl: './experiment-navigate-workspace.component.html',
    styleUrls: []
})
export class ExperimentNavigateWorkspaceComponent implements OnInit, OnDestroy {

    experimentId: number;

    constructor(private router: Router, private route: ActivatedRoute) {

    }

    ngOnInit() {
        this.route.params
            .pipe(untilComponentDestroyed(this))
            .subscribe((params: Params) => {
                this.experimentId = +params.id;
            });
    }

    ngOnDestroy() {

    }

    onNavigate(workspace: string) {
        this.router.navigate(['/experiments', 'details', this.experimentId, workspace]);
    }

}
