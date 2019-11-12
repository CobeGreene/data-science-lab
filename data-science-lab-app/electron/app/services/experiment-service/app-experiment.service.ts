import { ExperimentService } from './experiment.service';
import { ServiceContainer, SERVICE_TYPES } from '../../services-container';
import { Experiment } from '../../../../shared/models';
import { ExperimentDataService } from '../../data-services';
import { ExperimentProducer } from '../../producers';


export class AppExperimentService implements ExperimentService {

    constructor(private serviceContainer: ServiceContainer) {

    }

    all(): void {
        const experimentDataService = this.serviceContainer.resolve<ExperimentDataService>(SERVICE_TYPES.ExperimentDataService);
        const experimentProducer = this.serviceContainer.resolve<ExperimentProducer>(SERVICE_TYPES.ExperimentProducer);
        experimentProducer.all(experimentDataService.all());
    }    
    
    create(): void {
        const experimentDataService = this.serviceContainer.resolve<ExperimentDataService>(SERVICE_TYPES.ExperimentDataService);
        const newExperiment = experimentDataService.create(new Experiment({}));
        const experimentProducer = this.serviceContainer.resolve<ExperimentProducer>(SERVICE_TYPES.ExperimentProducer);
        experimentProducer.all(experimentDataService.all());
        experimentProducer.newExperiment(newExperiment);
    }

}

