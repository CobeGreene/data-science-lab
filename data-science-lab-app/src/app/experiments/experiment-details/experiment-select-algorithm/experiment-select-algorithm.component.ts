import { Component, OnInit, OnDestroy } from '@angular/core';
import { ExperimentSelectAlgorithmStage, Experiment } from '../../../../../shared/models';
import { ActivatedRoute, Params } from '@angular/router';
import { ExperimentService } from '../../../services';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

@Component({
    selector: 'app-experiment-select-algorithm',
    templateUrl: './experiment-select-algorithm.component.html',
    styleUrls: []
})
export class ExperimentSelectAlgorithmComponent implements OnInit, OnDestroy {

    id: number;
    experiment: ExperimentSelectAlgorithmStage;
    length: number;

    constructor(private experimentService: ExperimentService,
                private route: ActivatedRoute) {

    }

    ngOnInit() {
        this.route.parent.params
            .pipe(untilComponentDestroyed(this))
            .subscribe((params: Params) => {
                this.id = +params.id;
                this.experiment = this.experimentService.get(this.id) as ExperimentSelectAlgorithmStage;
            });

        this.experimentService.experimentUpdated
            .pipe(untilComponentDestroyed(this))
            .subscribe((experiment: Experiment) => {
                if (this.id === experiment.id) {
                    this.experiment = experiment as ExperimentSelectAlgorithmStage;
                }
            });
    }

    ngOnDestroy() {

    }
} 
