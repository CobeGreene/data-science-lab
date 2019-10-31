import { Component, OnInit, OnDestroy } from '@angular/core';
import { Plugin } from '../../../../../../shared/models';
import { ExperimentService } from '../../../../services';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-experiment-fetch-plugins',
    templateUrl: './experiment-fetch-plugins.component.html',
    styleUrls: []
})
export class ExperimentFetchPluginsComponent implements OnInit, OnDestroy {

    plugins: Plugin[];

    constructor(private experimentService: ExperimentService, private route: ActivatedRoute) {

    }

    ngOnInit() {
        this.plugins = this.experimentService.getFetchPlugins();
        this.experimentService.fetchPlugins
            .pipe(untilComponentDestroyed(this))
            .subscribe((value: Plugin[]) => {
                this.plugins = value;
            });
    }

    ngOnDestroy() {

    }
} 
