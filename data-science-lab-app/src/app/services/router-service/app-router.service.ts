import { Injectable } from '@angular/core';
import { RouterService } from './router.service';
import { ExperimentRoute } from '../../models/experiment-route';
import { Router } from '@angular/router';

@Injectable() 
export class AppRouterService extends RouterService {
    currentRoute: string;

    routeData?: ExperimentRoute;

    constructor(private router: Router) {
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
        this.routeChanged.next(route);
    }
}
