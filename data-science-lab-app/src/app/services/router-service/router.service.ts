import { Subject } from 'rxjs';
import { OnDestroy } from '@angular/core';
import { ExperimentRoute } from '../../models/experiment-route';

export abstract class RouterService implements OnDestroy {
    routeChanged: Subject<string>;

    constructor() {
        this.routeChanged = new Subject<string>();
    }

    abstract current(): string;
    abstract data(): ExperimentRoute;
    abstract navigate(route: string, data?: ExperimentRoute);

    ngOnDestroy() {
        this.routeChanged.complete();
    }
} 

