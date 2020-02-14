import { AlgorithmTrackerService } from './algorithm-tracker.service';
import { ServiceContainer, SERVICE_TYPES } from '../../services-container';
import { AlgorithmTrackerDataService } from '../../data-services';
import { AlgorithmTrackerProducer } from '../../producers';


export class AppAlgorithmTrackerService implements AlgorithmTrackerService {

    constructor(private serviceContainer: ServiceContainer) {

    }

    all() {
        const dataService = this.serviceContainer.resolve<AlgorithmTrackerDataService>(SERVICE_TYPES.AlgorithmTrackerDataService);
        const producer = this.serviceContainer.resolve<AlgorithmTrackerProducer>(SERVICE_TYPES.AlgorithmTrackerProducer);
        producer.all(dataService.all());
    }
}
