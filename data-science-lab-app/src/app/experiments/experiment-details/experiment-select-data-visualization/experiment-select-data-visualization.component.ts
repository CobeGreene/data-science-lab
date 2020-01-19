import { OnInit, OnDestroy, Component } from '@angular/core';
import { ActivatedRoute, Route, Router, Params } from '@angular/router';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { VisualizationDataSessionService } from '../../../services';


@Component({
    selector: 'app-experiment-select-data-visualization',
    templateUrl: './experiment-select-data-visualization.component.html',
    styleUrls: []
})
export class ExperimentSelectDataVisualizationComponent implements OnInit, OnDestroy {
    experimentId: number;

    constructor(private route: ActivatedRoute,
                private router: Router) {

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

    onBack(): void {
        this.router.navigate(['/experiments', 'details', this.experimentId, 'data-workspace']);
    }
}

