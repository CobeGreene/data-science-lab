import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { TransformPluginViewModel } from '../../../../../../shared/view-models';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { TransformPluginsService } from '../../../../services';

@Component({
    selector: 'app-experiment-select-transform-plugin-card',
    templateUrl: './experiment-select-transform-plugin-card.component.html',
    styleUrls: []
})
export class ExperimentSelectTransformPluginCardComponent implements OnInit, OnDestroy {

    @Input()
    transformPlugin: TransformPluginViewModel;

    experimentId: number;
    dataGroupId: number;

    constructor(private route: ActivatedRoute, private router: Router,
                private service: TransformPluginsService) {
        
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
        this.service.select(this.dataGroupId, this.transformPlugin);
        this.router.navigate(['/experiments', 'details', this.experimentId, 'input-transform', this.dataGroupId]);
    }

}
