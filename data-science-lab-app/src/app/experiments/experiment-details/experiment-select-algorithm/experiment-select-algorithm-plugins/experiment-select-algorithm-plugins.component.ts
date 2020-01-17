import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlgorithmPluginViewModel } from '../../../../../../shared/view-models';
import { AlgorithmPluginsService } from '../../../../services';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';


@Component({
    selector: 'app-experiment-select-algorithm-plugins',
    templateUrl: './experiment-select-algorithm-plugins.component.html',
    styleUrls: []
})
export class ExperimentSelectAlgorithmPluginsComponent implements OnInit, OnDestroy {

    plugins: AlgorithmPluginViewModel[];

    constructor(private service: AlgorithmPluginsService) {

    }

    ngOnInit() {
        this.plugins = this.service.all();
        this.service.algorithmPluginsChanged
            .pipe(untilComponentDestroyed(this))
            .subscribe((value) => {
                this.plugins = value;
            });
    }

    ngOnDestroy() {

    }
}
