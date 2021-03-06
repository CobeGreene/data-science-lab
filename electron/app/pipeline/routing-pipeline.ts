import { ServiceContainer, SERVICE_TYPES } from '../service-container';
import { Route } from './route';
import { IpcService, Listener } from '../../../shared/services';
import { ServiceModelRoutes } from './service-model.routes';
import { Producer } from './producer';

export class RoutingPipeline {

    private ipc: IpcService;

    constructor(private serviceContainer: ServiceContainer, private serviceModelRoutes: ServiceModelRoutes[]) {
        this.ipc = serviceContainer.resolve<IpcService>(SERVICE_TYPES.IpcService);
    }

    initialize() {
        this.serviceModelRoutes.forEach((serviceModelRoutes: ServiceModelRoutes) => {
            serviceModelRoutes.routes.forEach((route: Route) => {
                this.ipc.on(this.getPath(route), (_event: string, ...args: any) => {
                    const producer = this.serviceContainer.resolve<Producer>(SERVICE_TYPES.Producer);
                    const service = this.serviceContainer.resolve(serviceModelRoutes.service, producer);
                    service[route.method](...args);
                });

            });
        });
    }

    private getPath(route: Route) {
        if (route.isListener !== undefined && route.isListener === true) {
            return `${route.path}-listener`;
        }
        return `${route.path}-event`;
    }
}
