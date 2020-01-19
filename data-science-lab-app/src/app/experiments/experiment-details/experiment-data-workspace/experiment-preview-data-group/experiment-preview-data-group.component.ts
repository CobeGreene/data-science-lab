import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { DataGroupViewModel } from '../../../../../../shared/view-models';
import { TransformSessionService, DataGroupsService, VisualizationDataSessionService } from '../../../../services';
import { Router } from '@angular/router';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';


@Component({
    selector: 'app-experiment-preview-data-group',
    templateUrl: './experiment-preview-data-group.component.html',
    styleUrls: []
})
export class ExperimentPreviewDataGroupComponent implements OnInit, OnDestroy {

    @Input() dataGroup: DataGroupViewModel;

    constructor(private transformService: TransformSessionService,
                private visualizeService: VisualizationDataSessionService,
                private dataService: DataGroupsService,
                private router: Router) {

    }

    ngOnDestroy(): void {

    }

    ngOnInit(): void {
        this.dataService.updatedDataGroup
            .pipe(untilComponentDestroyed(this))    
            .subscribe((value) => {
                if (value.id === this.dataGroup.id) {
                    this.dataGroup = value;
                }
            });
    }

    onTransform(): void {
        if (this.transformService.hasSession(this.dataGroup.id)) {
            this.router.navigate(['/experiments', 'details', this.dataGroup.experimentId, 'setup-transform', this.dataGroup.id]);
        } else {
            this.router.navigate(['/experiments', 'details', this.dataGroup.experimentId, 'select-transform', this.dataGroup.id]);
        }
    }

    onVisualize(): void {

    }

}
