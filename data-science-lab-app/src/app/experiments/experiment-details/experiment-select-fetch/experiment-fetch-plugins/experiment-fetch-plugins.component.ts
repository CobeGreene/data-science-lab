import { Component, OnInit, OnDestroy } from '@angular/core';
import { Plugin } from '../../../../../../shared/models';
import { FetchPluginsService } from '../../../../services';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';


@Component({
    selector: 'app-experiment-fetch-plugins',
    templateUrl: './experiment-fetch-plugins.component.html',
    styleUrls: []
})
export class ExperimentFetchPluginsComponent implements OnInit, OnDestroy {

    plugins: Plugin[];

    constructor(private fetchPluginsService: FetchPluginsService) {

    }


    ngOnInit() {
        this.plugins = this.fetchPluginsService.all();
        this.fetchPluginsService.fetchPluginsChanged
            .pipe(untilComponentDestroyed(this))
            .subscribe((value) => {
                this.plugins = value;
            });
    }

    ngOnDestroy() {

    }
}
