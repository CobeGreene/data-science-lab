import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Plugin } from '../../../../../../shared/models';
import { FetchSessionService } from '../../../../services';
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

    experimentId: number;

    constructor(private fetchSessionService: FetchSessionService, private route: ActivatedRoute) {

    }

    ngOnInit() {
        this.route.parent.params
            .pipe(untilComponentDestroyed(this))
            .subscribe((params: Params) => {
                this.experimentId = +params.id;
            });
    }

    ngOnDestroy() {

    }

    onSelect() {
        this.fetchSessionService.create(this.experimentId, this.plugin);
    }
}
