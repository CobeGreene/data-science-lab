import { Injectable } from '@angular/core';
import { RouterService } from './router.service';
import { ExperimentRoute } from '../../models/experiment-route';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable() 
export class AppRouterService extends RouterService {
    currentRoute: string;

    routeData?: ExperimentRoute;

    constructor(private router: Router, private route: ActivatedRoute) {
        super();
        this.currentRoute = '/';
    }

    current() {
        return this.currentRoute;
    }

    data(): ExperimentRoute {
        return this.routeData;
    }

    navigate(route: string, data?: ExperimentRoute) {
        this.currentRoute = route;
        this.routeData = data;
        this.router.navigateByUrl(route);
    }

    changed() {
        return this.router.events.pipe(filter(event => event instanceof NavigationEnd));
    }
}
