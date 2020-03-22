import { SERVICE_TYPES } from '../service-container';
import { Route } from './route';

export interface ServiceModelRoutes {
    routes: Route[];
    service: SERVICE_TYPES;
}
