import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { DataGroupViewModel } from '../../../../../../shared/view-models';
import { TransformSessionService } from '../../../../services';
import { Router } from '@angular/router';


@Component({
    selector: 'app-experiment-preview-data-group',
    templateUrl: './experiment-preview-data-group.component.html',
    styleUrls: []
})
export class ExperimentPreviewDataGroupComponent implements OnInit, OnDestroy {

    @Input() dataGroup: DataGroupViewModel;

    constructor(private service: TransformSessionService,
                private router: Router) {

    }

    ngOnDestroy(): void {

    }

    ngOnInit(): void {

    }

    onTransform(): void {
        if (this.service.hasSession(this.dataGroup.experimentId, this.dataGroup.id)) {

        } else {
            this.router.navigate(['/experiments', 'details', this.dataGroup.experimentId, 'select-transform', this.dataGroup.id]);
        }
    }

}
