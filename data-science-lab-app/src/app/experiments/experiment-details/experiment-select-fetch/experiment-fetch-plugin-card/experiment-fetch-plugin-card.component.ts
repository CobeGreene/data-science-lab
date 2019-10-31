import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Plugin } from '../../../../../../shared/models';
import { ExperimentService } from '../../../../services';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

@Component({
    selector: 'app-experiment-fetch-plugin-card',
    templateUrl: './experiment-fetch-plugin-card.component.html',
    styleUrls: []
})
export class ExperimentFetchPluginCardComponent implements OnInit, OnDestroy {
    @Input()
    plugin: Plugin;

    id: number;

    constructor(private experimentService: ExperimentService, private route: ActivatedRoute) {

    }

    ngOnInit() {
        this.route.parent.params
            .pipe(untilComponentDestroyed(this))
            .subscribe((params: Params) => {
                this.id = +params.id;
            });
    }

    ngOnDestroy() {

    }

    onSelect() {
        this.experimentService.selectFetchPlugin(this.id, this.plugin);
    }
}
