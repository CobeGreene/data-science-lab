import { OnInit, OnDestroy, Component } from '@angular/core';
import { VisualizationAlgorithmSessionService, VisualizationPluginsService, AlgorithmTrackerService } from '../../../services';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { AlgorithmTrackerViewModel, VisualizationPluginViewModel } from '../../../../../shared/view-models';

@Component({
    selector: 'app-experiment-input-algorithm-visualization',
    templateUrl: './experiment-input-algorithm-visualization.component.html',
    styleUrls: []
})
export class ExperimentInputAlgorithmVisualizationComponent implements OnInit, OnDestroy {
    

    tracker: AlgorithmTrackerViewModel;
    visualizationPlugin: VisualizationPluginViewModel;
    id: number;
    experimentId: number;


    constructor(private route: ActivatedRoute,
                private router: Router,
                private pluginsService: VisualizationPluginsService,
                private sessionService: VisualizationAlgorithmSessionService,
                private algorithmTrackerService: AlgorithmTrackerService) {
    }
    
    ngOnInit(): void {
        this.route.params
            .pipe(untilComponentDestroyed(this))
            .subscribe((params: Params) => {
                this.id = +params.algorithmId;
                this.visualizationPlugin = this.pluginsService.getAlgorithm(this.id);
                this.tracker = this.algorithmTrackerService.get(this.id);
            });

        this.route.parent.params
            .pipe(untilComponentDestroyed(this))
            .subscribe((params: Params) => {
                this.experimentId = + params.id;
            });

        this.sessionService.newSession
            .pipe(untilComponentDestroyed(this))
            .subscribe((value) => {
                if (value.id === this.id) {
                    this.router.navigate(['/experiments', 'details', 
                        this.experimentId, 'setup-algorithm-visualization', this.id]);
                }
            });
        
        this.sessionService.sessionFinished
            .pipe(untilComponentDestroyed(this))
            .subscribe((value) => {
                if (value === this.id) {
                    this.router.navigate(['/experiments', 'details', this.experimentId, 'data-workspace']);
                }
            });
    }    
    
    ngOnDestroy(): void {
    }

    onSubmit(inputs: {[id: string]: number[]}) {
        this.sessionService.create(this.id, this.visualizationPlugin, inputs);
    }

    onBack() {
        this.pluginsService.deselectAlgorithm(this.id);
        this.router.navigate(['/experiments', 'details', this.experimentId, 
            'select-algorithm-visualization', this.id]);        
    }

}



