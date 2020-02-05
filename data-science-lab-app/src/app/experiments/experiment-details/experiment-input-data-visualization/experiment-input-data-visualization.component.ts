import { OnInit, OnDestroy, Component } from '@angular/core';
import { VisualizationDataSessionService, VisualizationPluginsService, DataGroupsService } from '../../../services';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { DataGroupViewModel, VisualizationPluginViewModel } from '../../../../../shared/view-models';

@Component({
    selector: 'app-experiment-input-data-visualization',
    templateUrl: './experiment-input-data-visualization.component.html',
    styleUrls: []
})
export class ExperimentInputDataVisualizationComponent implements OnInit, OnDestroy {
    

    dataGroup: DataGroupViewModel;
    visualizationPlugin: VisualizationPluginViewModel;
    dataGroupId: number;


    constructor(private route: ActivatedRoute,
                private router: Router,
                private pluginsService: VisualizationPluginsService,
                private sessionService: VisualizationDataSessionService,
                private dataGroupService: DataGroupsService) {
    }
    
    ngOnInit(): void {
        this.route.params
            .pipe(untilComponentDestroyed(this))
            .subscribe((params: Params) => {
                this.dataGroupId = +params.dataGroupId;
                this.visualizationPlugin = this.pluginsService.getDataGroup(this.dataGroupId);
                this.dataGroup = this.dataGroupService.get(this.dataGroupId);
            });

        this.sessionService.newSession
            .pipe(untilComponentDestroyed(this))
            .subscribe((value) => {
                if (value.id === this.dataGroupId) {
                    this.router.navigate(['/experiments', 'details', 
                        this.dataGroup.experimentId, 'setup-data-visualization', this.dataGroupId]);
                }
            });
        
        this.sessionService.sessionFinished
            .pipe(untilComponentDestroyed(this))
            .subscribe((value) => {
                if (value === this.dataGroupId) {
                    this.router.navigate(['/experiments', 'details', this.dataGroup.experimentId, 'data-workspace']);
                }
            });
    }    
    
    ngOnDestroy(): void {
    }

    onSubmit(inputs: {[id: string]: number[]}) {
        this.sessionService.create(this.dataGroupId, this.visualizationPlugin, inputs);
    }

    onBack() {
        this.pluginsService.deselectDataGroup(this.dataGroupId);
        this.router.navigate(['/experiments', 'details', this.dataGroup.experimentId, 
            'select-data-visualization', this.dataGroup.id]);        
    }

}



