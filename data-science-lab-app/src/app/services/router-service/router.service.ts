import { Observable } from 'rxjs';
import { OnDestroy } from '@angular/core';
import { ExperimentRoute } from '../../models/experiment-route';
import { Event } from '@angular/router';

export abstract class RouterService implements OnDestroy {

    constructor() {
        
    }

    abstract current(): string;
    abstract data(): ExperimentRoute;
    abstract navigate(route: string, data?: ExperimentRoute);
    abstract changed(): Observable<Event>;

    ngOnDestroy() {
    }
} 

