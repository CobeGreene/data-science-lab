import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { AlgorithmViewModel } from '../../../../../../shared/view-models';
import { AlgorithmService } from '../../../../services';
import { Router } from '@angular/router';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';




@Component({
    selector: 'app-experiment-algorithm-card',
    templateUrl: './experiment-algorithm-card.component.html',
    styleUrls: []
})
export class ExperimentAlgorithmCardComponent implements OnInit, OnDestroy {

    @Input() algorithm: AlgorithmViewModel;

    constructor(private service: AlgorithmService,
                private router: Router) {
    }

    ngOnInit(): void {
        this.service.updatedAlgorithm
            .pipe(untilComponentDestroyed(this))
            .subscribe((value) => {
                if (value.id === this.algorithm.id) {
                    this.algorithm = value;
                }
            });
    }

    ngOnDestroy(): void {

    }

    onDetails() {
        this.router.navigate(['/experiments', 'details', this.algorithm.experimentId, 'algorithm', this.algorithm.id]);
    }


}
