import { NgZone, OnInit, OnDestroy, Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';


@Component({
    selector: 'app-experiment-algorithm-workspace',
    templateUrl: './experiment-algorithm-workspace.component.html',
    styleUrls: []
})
export class ExperimentAlgorithmWorkspaceComponent implements OnInit, OnDestroy {

    private experimentId: number;


    constructor(private route: ActivatedRoute, private router: Router) {

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

    onTrainAlgorithm() {
        // route
    }    

}


