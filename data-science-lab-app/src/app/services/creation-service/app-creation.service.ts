import { Injectable, OnDestroy } from '@angular/core';
import { CreationService } from './creation.service';
import { TabService } from '../tab-service';
import { TabFactory } from '../../factory/tab-factory';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { ExperimentService } from '../experiment-service';
import { FetchSessionService } from '../../session-services/fetch-session-service';

@Injectable()
export class AppCreationService extends CreationService implements OnDestroy {

    constructor(
        private tabService: TabService,
        private tabFactory: TabFactory,
        private experimentService: ExperimentService,
        private fetchSessionService: FetchSessionService) {
        super();
        this.subscribe();
    }

    subscribe() {
        this.experimentService.experimentCreated
            .pipe(untilComponentDestroyed(this))
            .subscribe((experiment) => {
                const tab = this.tabFactory.create(['experiment', experiment.id]);
                this.tabService.openTab(tab);
            });

        this.experimentService.experimentLoaded
            .pipe(untilComponentDestroyed(this))
            .subscribe((experiment) => {
                const tab = this.tabFactory.create(['experiment', experiment.id]);
                this.tabService.openTab(tab);
            });

        this.fetchSessionService.sessionCreated
            .pipe(untilComponentDestroyed(this))
            .subscribe((id) => {
                const session = this.fetchSessionService.get(id);
                const tab = this.tabFactory.create(['experiment', session.keyId, 'dataset', 'fetch', id, session.state]);
                if (session.sessionOptions.newTab) {
                    this.tabService.openTab(tab);
                } else {
                    this.tabService.replaceTab(session.sessionOptions.currentRoute, tab);
                }
            });
    }

    ngOnDestroy() {

    }

}

