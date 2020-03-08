import { ExperimentRoute } from './experiment-route';
import { Subscription } from 'rxjs';

export interface Tab {
    name: string;
    route: string;
    data?: ExperimentRoute;
    sub?: Subscription[] | Subscription;
    close?: () => void;
}

