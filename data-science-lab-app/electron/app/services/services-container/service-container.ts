import { Container } from 'inversify';
import { SERVICE_TYPES } from './symbol-types';
import { PackageIpcService, AppPackageIpcService } from '../ipc-services/package-ipc-services/';

export class ServiceContainer {
    private container: Container;

    constructor() {
        this.container = new Container();
    }

    configure() {
        this.container.bind<PackageIpcService>(SERVICE_TYPES.PackageIpcService).to(AppPackageIpcService);
    }

    resolve<T>(symbol: symbol): T {
        return this.container.get<T>(symbol);
    }
}
