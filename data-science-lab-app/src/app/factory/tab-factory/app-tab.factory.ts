import { Injectable } from '@angular/core';
import { TabFactory } from './tab.factory';
import { Tab } from '../../models';


@Injectable()
export class AppTabFactory extends TabFactory {

    constructor() {
        super();
    }

    validRoutes(routes: any[]) {
        if (routes.length === 0) {
            throw new Error(`Invalid route to create tab.`);
        }
    }
    create(routes: any[]): Tab {
        this.validRoutes(routes);
        if (routes[0] === 'settings') {
            return { name: 'Settings', route: '/settings' };
        } else if (routes[0] === 'welcome') {
            return { name: 'Welcome', route: '/welcome' };
        } else {
            throw new Error(`Invalid route to create tab.`);
        }
    }
}

