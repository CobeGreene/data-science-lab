import { Component, OnInit, OnDestroy } from '@angular/core';
import { ExperimentService } from '../../services';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { ExperimentStages, Experiment } from '../../../../shared/models';


@Component({
    selector: 'app-experiment-details',
    templateUrl: './experiment-details.html',
    styleUrls: []
})
export class ExperimentDetailsComponent implements OnInit, OnDestroy {

    private id: number;
    private stage: ExperimentStages;

    constructor(private experimentService: ExperimentService,
                private route: ActivatedRoute,
                private router: Router) {
    
    }

    ngOnInit(): void {
        this.route.params
            .pipe(untilComponentDestroyed(this))
            .subscribe((params: Params) => {
                this.id = +params.id;
                this.stage = this.experimentService.get(this.id).stage;
            });

        this.experimentService.experimentUpdated
            .pipe(untilComponentDestroyed(this))
            .subscribe((experiment: Experiment) => {
                if (experiment.id === this.id && experiment.stage !== this.stage) {
                    console.log(`Details got update: ${JSON.stringify(experiment)}`);
                    this.router.navigate(['/experiments', 'details', experiment.id, experiment.stage]);
                }
            });
    }

    ngOnDestroy(): void {

    }
}
