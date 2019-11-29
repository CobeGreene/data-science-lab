import { RecorderService, VariableTracker } from 'data-science-lab-core';
import { ServiceContainer, SERVICE_TYPES } from '../../services-container';
import { AlgorithmRecorderService } from './algorithm-recorder.service';
import { AlgorithmTrackerDataService } from '../../data-services';
import { AlgorithmTrackerProducer } from '../../producers';

export class AppRecorderService implements AlgorithmRecorderService {
    
    private id: number;

    setAlgorithmId(id: number) {
        this.id = id;
    }
    
    constructor(private serviceContainer: ServiceContainer) {
        
    }

    record(variables: VariableTracker[]): void {
        const dataService = this.serviceContainer.resolve<AlgorithmTrackerDataService>(SERVICE_TYPES.AlgorithmTrackerDataService);
        const producer = this.serviceContainer.resolve<AlgorithmTrackerProducer>(SERVICE_TYPES.AlgorithmTrackerProducer);
        if (dataService.has(this.id)) {
            const tracker = dataService.update(this.id, variables);
            producer.updateTracker(tracker);
        } else {
            const tracker = dataService.create(this.id, variables);
            producer.newTracker(tracker);
        }
    }

}
