import { Component, OnInit, OnDestroy } from '@angular/core';
import { SelectTransformPlugin } from '../../../../../../shared/models';
import { TransformPluginsService } from '../../../../services';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';


@Component({
    selector: 'app-experiment-select-transform-plugins',
    templateUrl: './experiment-select-transform-plugins.component.html',
    styleUrls: []
})
export class ExperimentSelectTransformPluginsComponent implements OnInit, OnDestroy {

    plugins: SelectTransformPlugin[];

    constructor(private service: TransformPluginsService) {

    }

    ngOnInit() {
        this.plugins = this.service.all();
        this.service.transformPluginsChanged
            .pipe(untilComponentDestroyed(this))
            .subscribe((value) => {
                this.plugins = value;
            });
    }

    ngOnDestroy() {

    }
}
