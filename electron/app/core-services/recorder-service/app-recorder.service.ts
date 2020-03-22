import { VariableTracker } from 'data-science-lab-core';
import { Service, ServiceContainer, SERVICE_TYPES } from '../../service-container';
import { Producer } from '../../pipeline';
import { AlgorithmRecorderService } from './algorithm-recorder.service';
import { TrackerDataService } from '../../data-services/tracker-data-service/tracker.data-service';
import { TrackerEvents } from '../../../../shared/events';

export class AppRecorderService extends Service implements AlgorithmRecorderService {
  
    get producer(): Producer {
        return this.serviceContainer.resolve<Producer>(SERVICE_TYPES.Producer);
    }
    
    get dataService(): TrackerDataService {
        return this.serviceContainer.resolve<TrackerDataService>(SERVICE_TYPES.TrackerDataService);
    }

    constructor(serviceContainer: ServiceContainer, public algorithmId: number, public iteration: number) {
        super(serviceContainer);
    
    }

    current(iteration: number) {
        this.iteration = iteration;
    }

    record(variables: VariableTracker[]): void {
        if (!this.dataService.has(this.algorithmId)) {
            this.dataService.create(this.algorithmId);
        }
        this.dataService.push(this.algorithmId, this.iteration, variables);
        this.producer.send(TrackerEvents.Change, this.algorithmId);
    }
} 
