import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { AlgorithmPluginViewModel } from '../../../../../../shared/view-models';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { AlgorithmPluginsService } from '../../../../services';

@Component({
    selector: 'app-experiment-select-algorithm-plugin-card',
    templateUrl: './experiment-select-algorithm-plugin-card.component.html',
    styleUrls: []
})
export class ExperimentSelectAlgorithmPluginCardComponent implements OnInit, OnDestroy {

    @Input()
    algorithmPlugin: AlgorithmPluginViewModel;

    experimentId: number;
    dataGroupId: number;

    constructor(private route: ActivatedRoute, private router: Router,
                private service: AlgorithmPluginsService) {
        
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
        this.service.select(this.dataGroupId, this.algorithmPlugin);
        this.router.navigate(['/experiments', 'details', this.experimentId, 'input-algorithm', this.dataGroupId]);
    }

}

