import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlgorithmViewModel } from '../../../../../../shared/view-models';
import { AlgorithmService } from '../../../../services';
import { ActivatedRoute, Params } from '@angular/router';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';




@Component({
    selector: 'app-experiment-algorithm-list',
    templateUrl: './experiment-algorithm-list.component.html',
    styleUrls: []
})
export class ExperimentAlgorithmListComponent implements OnInit, OnDestroy {

    private experimentId: number;
    private algorithms: AlgorithmViewModel[];

    constructor(private service: AlgorithmService,
                private route: ActivatedRoute) {
        this.algorithms = [];
    }

    ngOnInit() {
        this.route.parent.params
            .pipe(untilComponentDestroyed(this))
            .subscribe((params: Params) => {
                this.experimentId = +params.id;
                this.algorithms = this.service.all(this.experimentId);
            });

        this.service.newAlgorithm
            .pipe(untilComponentDestroyed(this))
            .subscribe((algorithm) => {
                if (algorithm.experimentId === this.experimentId) {
                    this.algorithms.push(algorithm);
                }
            });

        this.service.deletedAlgorithm
            .pipe(untilComponentDestroyed(this))
            .subscribe((id) => {
                const findIndex = this.algorithms.findIndex((value) => {
                    return value.id === id;
                });
                if (findIndex >= 0) {
                    this.algorithms.splice(findIndex, 1);
                }
            });
    }

    ngOnDestroy() {

    }

}


