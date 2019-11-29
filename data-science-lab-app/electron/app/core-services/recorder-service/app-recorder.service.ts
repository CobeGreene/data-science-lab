import { RecorderService, VariableTracker } from 'data-science-lab-core';
import { ServiceContainer, SERVICE_TYPES } from '../../services-container';

export class AppRecorderService implements RecorderService {
    
    constructor(private serviceContainer: ServiceContainer) {
        
    }

    record(variables: VariableTracker[]): void {
        // not implemented yet.
        console.log(`Variables: ${JSON.stringify(variables)}`);
    }

}
