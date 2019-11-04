import { Component, OnInit, OnDestroy } from '@angular/core';
import { ExperimentService } from '../../../services';
import { ActivatedRoute, Params } from '@angular/router';
import { Experiment, ExperimentSetupFetchStage } from '../../../../../shared/models';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

@Component({
    selector: 'app-experiment-setup-fetch',
    templateUrl: './experiment-setup-fetch.component.html',
    styleUrls: []
})
export class ExperimentSetupFetchComponent implements OnInit, OnDestroy {

    id: number;
    experiment: ExperimentSetupFetchStage;

    constructor(private experimentService: ExperimentService, private route: ActivatedRoute) {

    }

    ngOnInit() {
        this.route.parent.params
            .pipe(untilComponentDestroyed(this))
            .subscribe((params: Params) => {
                this.id = +params.id;
                this.experiment = this.experimentService.get(this.id) as ExperimentSetupFetchStage;
            });
            
        this.experimentService.experimentUpdated
            .pipe(untilComponentDestroyed(this))
            .subscribe((experiment: Experiment) => {
                if (this.id === experiment.id) {
                    this.experiment = experiment as ExperimentSetupFetchStage;
                }
            });

    }

    ngOnDestroy() {

    }


} 
