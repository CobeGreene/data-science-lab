import { Injectable } from '@angular/core';
import { TabFactory } from './tab.factory';
import { Tab } from '../../models';
import { ExperimentTabBuilder } from './experiment-tab.builder';
import { ExperimentService } from '../../services/experiment-service';
import { TabService } from '../../services/tab-service';
import { RoutesHandler } from './routes-handler';

@Injectable()
export class AppTabFactory extends TabFactory {

    constructor(
        private tabService: TabService,
        private experimentService: ExperimentService
    ) {
        super();
    }

    validRoutes(routes: any[]) {
        if (routes.length === 0) {
            throw new Error(`Invalid route to create tab.`);
        }
    }
    create(routes: any[]): Tab {
        const handler = new RoutesHandler(routes);
        if (handler.get(0) === 'settings') {
            return { name: 'Settings', route: '/settings' };
        } else if (handler.get(0) === 'welcome') {
            return { name: 'Welcome', route: '/welcome' };
        } else if (handler.get(0) === 'package' && !handler.has(1)) {
            return { name: 'Package Explorer', route: '/package' };
        } else if (handler.get(0) === 'package' && handler.has(1)) {
            return { name: handler.get(1) as string, route: `/package/${handler.get(1)}` };
        } else if (handler.get(0) === 'experiment') {
            return this.createExperimentRoute(handler.skip(1));
        } else {
            throw handler.invalidRoute();
        }
    }

    createExperimentRoute(handler: RoutesHandler): Tab {
        if (handler.isNumber(0)) {
            const experimentId = +handler.get(0);
            const experimentTitle = this.experimentService.get(experimentId).title;
            handler.skip(1);

            const builder = new ExperimentTabBuilder(experimentId, experimentTitle, this.tabService, this)
                .buildUpdate(this.experimentService.experimentUpdated)
                .buildDelete(this.experimentService.experimentDeleted);

            if (handler.done()) {
                return builder.build();
            }
        }
        throw handler.invalidRoute();
    }
}

