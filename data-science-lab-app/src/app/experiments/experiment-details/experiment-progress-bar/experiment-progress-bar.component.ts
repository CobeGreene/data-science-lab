import { Component, OnInit, OnDestroy } from '@angular/core';
import { ExperimentStages, ExperimentList } from '../../../../../shared/models';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { ExperimentService } from '../../../services';

@Component({
    selector: 'app-experiment-progress-bar',
    templateUrl: './experiment-progress-bar.component.html',
    styleUrls: []
})
export class ExperimentProgressBarComponent implements OnInit, OnDestroy {

    id: number;
    stage: ExperimentStages;

    constructor(private route: ActivatedRoute, private experimentService: ExperimentService) {

    }

    ngOnInit() {
        this.route.params
            .pipe(untilComponentDestroyed(this))
            .subscribe((params: Params) => {
                this.id = +params.id;
                const experiment = this.experimentService.get(this.id);
                this.stage = experiment.stage;
            });
        this.experimentService.experimentsChanged
            .pipe(untilComponentDestroyed(this))
            .subscribe((value: ExperimentList) => {
                const find = value.experiments.find((experiment) => {
                    return experiment.id === this.id;
                });
                if (find) {
                    this.stage = find.stage;
                }
            });
            
    }

    ngOnDestroy() {

    }

    isPrepareData() {
        return this.stage === ExperimentStages.Select_Fetch || this.stage === ExperimentStages.Setup_Fetch;
    }

    isSelectAlgorithm() {
        return this.stage === ExperimentStages.Select_Algorithm || this.stage === ExperimentStages.Setup_Algorithm;
    }

    isTrainAlgorithm() {
        return this.stage === ExperimentStages.Train_Algorithm;
    }

    isTestAlgorithm() {
        return this.stage === ExperimentStages.Test_Algorithm;
    }

} 