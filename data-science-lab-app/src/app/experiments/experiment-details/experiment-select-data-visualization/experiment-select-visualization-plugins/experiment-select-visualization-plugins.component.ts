import { Component, OnInit, OnDestroy } from '@angular/core';
import { VisualizationPluginViewModel } from '../../../../../../shared/view-models';
import { VisualizationPluginsService } from '../../../../services';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';


@Component({
    selector: 'app-experiment-select-visualization-plugins',
    templateUrl: './experiment-select-visualization-plugins.component.html',
    styleUrls: []
})
export class ExperimentSelectVisualizationPluginsComponent implements OnInit, OnDestroy {

    plugins: VisualizationPluginViewModel[];

    constructor(private service: VisualizationPluginsService) {

    }

    ngOnInit() {
        this.plugins = this.service.all();
        this.service.visualizationPluginsChanged
            .pipe(untilComponentDestroyed(this))
            .subscribe((value) => {
                this.plugins = value;
            });
    }

    ngOnDestroy() {

    }
}
