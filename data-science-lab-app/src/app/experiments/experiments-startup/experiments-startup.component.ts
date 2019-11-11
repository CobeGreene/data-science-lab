import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { Experiment } from '../../../../shared/models';
import { Router } from '@angular/router';
import { ExperimentService } from '../../services/experiment-services';

@Component({
    selector: 'app-experiments-startup',
    templateUrl: './experiments-startup.component.html',
    styleUrls: []
})
export class ExperimentStartupComponent implements OnInit, OnDestroy {

    creating: boolean;

    constructor(private router: Router, private zone: NgZone, private experimentService: ExperimentService) {
        this.creating = false;
    }

    ngOnInit() {
        this.experimentService.newExperiment
            .pipe(untilComponentDestroyed(this))
            .subscribe((value: Experiment) => {
                this.creating = false;
                this.router.navigate(['/experiments', 'details', `${value.id}`]);
            });
    }

    ngOnDestroy() {

    }

    public onCreateExperiment() {
        this.creating = true;
        this.experimentService.create();
    }
}
