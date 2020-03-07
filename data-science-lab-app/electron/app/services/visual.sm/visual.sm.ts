import { ServiceContainer, SERVICE_TYPES } from '../../service-container';
import { ServiceModelRoutes, Producer, } from '../../pipeline';
import { VisualEvents } from '../../../../shared/events';
import { ServiceModel } from '../service-model';
import { VisualDataService } from '../../data-services/visual-data-service';


export class VisualServiceModel extends ServiceModel {
    static routes: ServiceModelRoutes = {
        service: SERVICE_TYPES.VisualServiceModel,
        routes: [
            { path: VisualEvents.All, method: 'all' },
            { path: VisualEvents.Delete, method: 'delete' },
        ]
    }

    private dataService: VisualDataService;

    constructor(serviceContainer: ServiceContainer, producer: Producer) {
        super(serviceContainer, producer);

        this.dataService = serviceContainer.resolve<VisualDataService>(SERVICE_TYPES.VisualDataService);
    }

    all() {
        this.producer.send(VisualEvents.All, this.dataService.all());
    }

    delete(id: number) {
        this.dataService.delete(id);
        this.producer.send(VisualEvents.Delete, id);
    }

    
}

