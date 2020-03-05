import { VariableTracker } from 'data-science-lab-core';
import { Service, ServiceContainer, SERVICE_TYPES } from '../../service-container';
import { Producer } from '../../pipeline';
import { AlgorithmRecorderService } from './algorithm-recorder.service';

export class AppRecorderService extends Service implements AlgorithmRecorderService {
  
    get producer(): Producer {
        return this.serviceContainer.resolve<Producer>(SERVICE_TYPES.Producer);
    }

    constructor(serviceContainer: ServiceContainer, public algorithmId: number, public iteration: number) {
        super(serviceContainer);
    
    }

    current(iteration: number) {
        this.iteration = iteration;
    }

    record(variables: VariableTracker[]): void {

    }
} 
