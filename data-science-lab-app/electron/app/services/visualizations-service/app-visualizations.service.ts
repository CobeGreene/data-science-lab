import { VisualizationsService } from './visualizations.service';
import { ServiceContainer, SERVICE_TYPES } from '../../services-container';
import { VisualizationDataService } from '../../data-services';
import { VisualizationsProducer } from '../../producers';

export class AppVisualizationsService  implements VisualizationsService {

    constructor(private serviceContainer: ServiceContainer) {

    }

    all(): void {
        const visualizationsDataService = 
            this.serviceContainer
            .resolve<VisualizationDataService>(SERVICE_TYPES.VisualizationDataService);
        const visualizations = visualizationsDataService.all();
        const producer = this.serviceContainer.resolve<VisualizationsProducer>(SERVICE_TYPES.VisualizationsProducer);
        producer.all(visualizations);
    }

    delete(id: number) {
        const visualiztionsDataService = 
        this.serviceContainer
        .resolve<VisualizationDataService>(SERVICE_TYPES.VisualizationDataService);
        visualiztionsDataService.delete(id);
        const producer = this.serviceContainer.resolve<VisualizationsProducer>(SERVICE_TYPES.VisualizationsProducer);
        producer.delete(id);
    }
}
