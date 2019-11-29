import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlgorithmService } from '../../../services';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AlgorithmViewModel } from '../../../../../shared/view-models';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';




@Component({
    selector: 'app-experiment-algorithm-details',
    templateUrl: './experiment-algorithm-details.component.html',
    styleUrls: []
})
export class ExperimentAlgorithmDetailsComponent implements OnInit, OnDestroy {

    id: number;
    algorithm: AlgorithmViewModel;

    constructor(private service: AlgorithmService, private route: ActivatedRoute) {

    }

    ngOnInit() {

        this.route.params
            .pipe(untilComponentDestroyed(this))
            .subscribe((params: Params) => {
                this.id = +params.algorithmId;
                this.algorithm = this.service.get(this.id);
            });

        this.service.updatedAlgorithm
            .pipe(untilComponentDestroyed(this))
            .subscribe((algorithm) => {
                if (algorithm.id === this.id) {
                    this.algorithm = algorithm;
                }
            });
    }

    ngOnDestroy() {

    }

    onStart() {
        this.service.start(this.id);
    }

    onStop() {
        this.service.stop(this.id);
    }
}

