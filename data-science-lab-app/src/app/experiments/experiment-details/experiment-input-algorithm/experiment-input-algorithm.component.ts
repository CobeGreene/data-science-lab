import { OnInit, OnDestroy, Component } from '@angular/core';
import { DataGroupsService, AlgorithmPluginsService, AlgorithmSessionService } from '../../../services';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { DataGroupViewModel, AlgorithmPluginViewModel } from '../../../../../shared/view-models';

@Component({
    selector: 'app-experiment-input-algorithm',
    templateUrl: './experiment-input-algorithm.component.html',
    styleUrls: []
})
export class ExperimentInputAlgorithmComponent implements OnInit, OnDestroy {
    

    dataGroup: DataGroupViewModel;
    algorithmPlugin: AlgorithmPluginViewModel;
    dataGroupId: number;

    constructor(private route: ActivatedRoute,
                private router: Router,
                private pluginsService: AlgorithmPluginsService,
                private sessionService: AlgorithmSessionService,
                private dataGroupService: DataGroupsService) {
    }
    
    ngOnInit(): void {
        this.route.params
            .pipe(untilComponentDestroyed(this))
            .subscribe((params: Params) => {
                this.dataGroupId = +params.dataGroupId;
                this.algorithmPlugin = this.pluginsService.get(this.dataGroupId);
                this.dataGroup = this.dataGroupService.get(this.dataGroupId);
            });

        this.sessionService.newSession
            .pipe(untilComponentDestroyed(this))
            .subscribe((value) => {
                console.log(`New session`);
                if (value.dataGroupId === this.dataGroupId) {
                    this.router.navigate(['/experiments', 'details', this.dataGroup.experimentId, 'setup-algorithm', this.dataGroupId]);
                }
            });
        
        this.sessionService.sessionFinished
            .pipe(untilComponentDestroyed(this))
            .subscribe((value) => {
                if (value === this.dataGroupId) {
                    this.router.navigate(['/experiments', 'details', this.dataGroup.experimentId, 'algorithm-workspace']);
                }
            });
    }    
    
    ngOnDestroy(): void {
    }

    onSubmit(inputs: {[id: string]: number[]}) {
        console.log(`Submitting to create session`);
        this.sessionService.create(this.dataGroupId, this.algorithmPlugin, inputs);
    }

    onBack() {
        this.pluginsService.deselect(this.dataGroupId);
        this.router.navigate(['/experiments', 'details', this.dataGroup.experimentId, 'select-algorithm', this.dataGroup.id]);        
    }

}



