import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Route, Router, Params } from '@angular/router';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { TransformSessionService } from '../../../services';



@Component({
    selector: 'app-experiment-select-transform',
    templateUrl: './experiment-select-transform.component.html',
    styleUrls: []
})
export class ExperimentSelectTransformComponent implements OnInit, OnDestroy {

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

    onBack(): void {
        this.router.navigate(['/experiments', 'details', this.experimentId, 'data-workspace']);
    }

}

