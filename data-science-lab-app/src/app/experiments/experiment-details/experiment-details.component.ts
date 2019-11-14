import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { Experiment } from '../../../../shared/models';
import { ExperimentService } from '../../services/experiment-services';

@Component({
    selector: 'app-experiment-details',
    templateUrl: './experiment-details.component.html',
    styleUrls: []
})
export class ExperimentDetailsComponent implements OnInit, OnDestroy {

    private id: number;
    private experiment: Experiment;

    constructor(private route: ActivatedRoute,
                private router: Router,
                private experimentService: ExperimentService) {
    
    }

    ngOnInit(): void {
        this.route.params
            .pipe(untilComponentDestroyed(this))
            .subscribe((params: Params) => {
                this.id = +params.id;
                this.experiment = this.experimentService.get(this.id);
            });
    }

    ngOnDestroy(): void {

    }
}
