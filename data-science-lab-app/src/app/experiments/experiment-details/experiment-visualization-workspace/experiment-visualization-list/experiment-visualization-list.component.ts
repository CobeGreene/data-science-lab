import { Component, OnInit, OnDestroy } from '@angular/core';
import { VisualizationsService } from '../../../../services';
import { ActivatedRoute, Params } from '@angular/router';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { Visualization } from '../../../../../../shared/models';

@Component({
    selector: 'app-experiment-visualization-list',
    templateUrl: './experiment-visualization-list.component.html',
    styleUrls: []
})
export class ExperimentVisualizationListComponent implements OnInit, OnDestroy {

    private experimentId: number;
    private visualizations: Visualization[];

    constructor(private visualizationService: VisualizationsService,
                private route: ActivatedRoute) {
        this.visualizations = [];
    }

    ngOnInit() {
        this.route.parent.params
            .pipe(untilComponentDestroyed(this))
            .subscribe((params: Params) => {
                this.experimentId = +params.id;
                this.visualizations = this.visualizationService.all(this.experimentId);
            });
            
        this.visualizationService.newVisualization
            .pipe(untilComponentDestroyed(this))
            .subscribe((visualization) => {
                if (visualization.experimentId === this.experimentId) {
                    this.visualizations.push(visualization);
                }
            });

        this.visualizationService.deletedVisualization
            .pipe(untilComponentDestroyed(this))
            .subscribe((id) => {
                const findIndex = this.visualizations.findIndex((value) => {
                    return value.id === id;
                });
                if (findIndex >= 0) {
                    this.visualizations.splice(findIndex, 1);
                }
            });

    }

    ngOnDestroy() {

    }
}

