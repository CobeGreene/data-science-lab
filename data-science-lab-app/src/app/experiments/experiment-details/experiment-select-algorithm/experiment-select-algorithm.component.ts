import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';


@Component({
    selector: 'app-experiment-select-algorithm',
    templateUrl: './experiment-select-algorithm.component.html',
    styleUrls: []
})
export class ExperimentSelectAlgorithmComponent implements OnInit, OnDestroy {

    experimentId: number;

    constructor(private route: ActivatedRoute,
                private router: Router) {

    }

    ngOnInit() {
        this.route.parent.params
            .pipe(untilComponentDestroyed(this))
            .subscribe((params: Params) => {
                this.experimentId = +params.id;
            });
    }


    ngOnDestroy() {
    }
    
    onBack() {
        this.router.navigate(['/experiments', 'details', this.experimentId, 'algorithm-workspace']);
    }
}

