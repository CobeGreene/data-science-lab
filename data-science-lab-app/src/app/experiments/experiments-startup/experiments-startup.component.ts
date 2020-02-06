import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { Experiment, ExperimentList } from '../../../../shared/models';
import { Router } from '@angular/router';
import { ExperimentService } from '../../services/experiment-services';

@Component({
    selector: 'app-experiments-startup',
    templateUrl: './experiments-startup.component.html',
    styleUrls: []
})
export class ExperimentStartupComponent implements OnInit, OnDestroy {

    creating: boolean;
    experimentList: ExperimentList;

    constructor(private router: Router, private zone: NgZone, private experimentService: ExperimentService) {
        this.creating = false;
    }

    ngOnInit() {
        this.experimentList = this.experimentService.all();

        this.experimentService.newExperiment
            .pipe(untilComponentDestroyed(this))
            .subscribe((value: Experiment) => {
                this.creating = false;
                this.router.navigate(['/experiments', 'details', `${value.id}`]);
            });

        this.experimentService.experimentsChanged
            .pipe(untilComponentDestroyed(this))
            .subscribe((value) => {
                this.experimentList = value;
            });

        this.experimentService.loadExperiment
            .pipe(untilComponentDestroyed(this))
            .subscribe((value) => {
                this.router.navigate(['/experiments', 'details', `${value}`]);
            });
    }

    ngOnDestroy() {

    }

    public onCreateExperiment() {
        this.creating = true;
        this.experimentService.create();
    }

    public onLoad(i: number) {
        const experiment = this.experimentList.experiments[i];
        if (experiment.isLoaded) {
            this.router.navigate(['/experiments', 'details', `${experiment.id}`]);
        } else {
            this.experimentService.load(experiment.id);
        }
    }
}
