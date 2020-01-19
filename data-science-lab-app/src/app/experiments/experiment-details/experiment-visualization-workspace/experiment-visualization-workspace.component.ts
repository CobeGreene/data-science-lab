import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

@Component({
    selector: 'app-experiment-visualization-workspace',
    templateUrl: './experiment-visualization-workspace.component.html',
    styleUrls: []
})
export class ExperimentVisualizationWorkspaceComponent implements OnInit, OnDestroy {
    private experimentId: number;

    constructor(private route: ActivatedRoute) {

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


}
