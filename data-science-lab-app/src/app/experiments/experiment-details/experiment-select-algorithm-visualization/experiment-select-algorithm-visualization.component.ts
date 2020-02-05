import { OnInit, OnDestroy, Component } from '@angular/core';
import { ActivatedRoute, Route, Router, Params } from '@angular/router';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { VisualizationAlgorithmSessionService, VisualizationPluginsService } from '../../../services';
import { VisualizationPluginViewModel } from '../../../../../shared/view-models';

@Component({
    selector: 'app-experiment-select-algorithm-visualization',
    templateUrl: './experiment-select-algorithm-visualization.component.html',
    styleUrls: []
})
export class ExperimentSelectAlgorithmVisualizationComponent implements OnInit, OnDestroy {

    experimentId: number;
    id: number;
    plugins: VisualizationPluginViewModel[];

    constructor(private route: ActivatedRoute,
                private router: Router,
                private service: VisualizationPluginsService) {

    }

    ngOnInit() {
        this.route.parent.params
            .pipe(untilComponentDestroyed(this))
            .subscribe((params: Params) => {
                this.experimentId = +params.id;
            });

        this.plugins = this.service.all();
        this.service.visualizationPluginsChanged
            .pipe(untilComponentDestroyed(this))
            .subscribe((value) => {
                this.plugins = value;
            });

        this.route.params
            .pipe(untilComponentDestroyed(this))
            .subscribe((params: Params) => {
                this.id = +params.algorithmId;
            });
    }

    ngOnDestroy() {

    }

    onBack(): void {
        this.router.navigate(['/experiments', 'details', this.experimentId, 'data-workspace']);
    }

    onSelect(index: number) {
        this.service.selectAlgorithm(this.id, this.plugins[index]);
        this.router.navigate(['/experiments', 'details', this.experimentId, 'input-algorithm-visualization', this.id]);
    }
}

