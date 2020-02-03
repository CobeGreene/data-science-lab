import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { VisualizationPluginViewModel } from '../../../../../../shared/view-models';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { VisualizationPluginsService } from '../../../../services';

@Component({
    selector: 'app-experiment-select-visualization-plugin-card',
    templateUrl: './experiment-select-visualization-plugin-card.component.html',
    styleUrls: []
})
export class ExperimentSelectVisualizationPluginCardComponent implements OnInit, OnDestroy {

    @Input()
    visualizationPlugin: VisualizationPluginViewModel;

    experimentId: number;
    dataGroupId: number;

    constructor(private route: ActivatedRoute, private router: Router,
                private service: VisualizationPluginsService) {
        
    }

    ngOnInit() {
        this.route.parent.params
            .pipe(untilComponentDestroyed(this))
            .subscribe((params: Params) => {
                this.experimentId = +params.id;
            });

        this.route.params
            .pipe(untilComponentDestroyed(this))
            .subscribe((params: Params) => {
                this.dataGroupId = +params.dataGroupId;
            });
    }

    ngOnDestroy() {

    }

    onSelect() {
        this.service.selectDataGroup(this.dataGroupId, this.visualizationPlugin);
        this.router.navigate(['/experiments', 'details', this.experimentId, 'input-data-visualization', this.dataGroupId]);
    }

}

