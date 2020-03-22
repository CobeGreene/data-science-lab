import { ServiceContainer } from './service-container';

export abstract class Service {
    constructor(protected serviceContainer: ServiceContainer) {

    }
}
