import { Service, ServiceContainer } from '../service-container';
import { Producer } from '../pipeline';

export abstract class ServiceModel extends Service {
    constructor(serviceContainer: ServiceContainer, protected producer: Producer) {
        super(serviceContainer);
    }
}
