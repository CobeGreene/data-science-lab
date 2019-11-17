import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { SelectTransformPlugin } from '../../../../../../shared/models';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

@Component({
    selector: 'app-experiment-select-transform-plugin-card',
    templateUrl: './experiment-select-transform-plugin-card.component.html',
    styleUrls: []
})
export class ExperimentSelectTransformPluginCardComponent implements OnInit, OnDestroy {

    @Input()
    transformPlugin: SelectTransformPlugin;

    experimentId: number;
    dataGroupId: number;

    constructor(private route: ActivatedRoute, private router: Router) {
        
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

    }

}

