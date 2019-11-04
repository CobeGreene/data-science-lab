import { Component, OnInit, OnDestroy } from '@angular/core';
import { ExperimentService } from '../../../../services';
import { ActivatedRoute, Params } from '@angular/router';
import { Plugin, ExperimentSetupFetchStage, ExperimentList, Experiment } from '../../../../../../shared/models';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

@Component({
    selector: 'app-experiment-setup-fetch-info',
    templateUrl: './experiment-setup-fetch-info.component.html',
    styleUrls: []
})
export class ExperimentSetupFetchInfoComponent implements OnInit, OnDestroy {

    id: number;
    plugin: Plugin;

    constructor(private experimentService: ExperimentService, private route: ActivatedRoute) {

    }

    ngOnInit() {
        this.route.parent.params
            .pipe(untilComponentDestroyed(this)) 
            .subscribe((params: Params) => {
                this.id = +params.id;
                const experiment = this.experimentService.get(this.id) as ExperimentSetupFetchStage;
                this.plugin = experiment.plugin;
            });

        this.experimentService.experimentUpdated
            .pipe(untilComponentDestroyed(this))
            .subscribe((value: Experiment) => {
                if (value.id === this.id) {
                    this.plugin = (value as ExperimentSetupFetchStage).plugin;
                }
            });
    }

    ngOnDestroy() {

    }
}
