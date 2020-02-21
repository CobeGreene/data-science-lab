import { SERVICE_TYPES, ServiceContainer, Service } from '../../service-container';
import { ServiceModelRoutes, Producer,  } from '../../pipeline';
import { ThemeEvents } from '../../../../shared/events';
import { ServiceModel  } from '../service-model';
import { ThemeDataService } from '../../data-services/theme-data-service';

export class ThemeServiceModel extends ServiceModel {
    static routes: ServiceModelRoutes = {
        service: SERVICE_TYPES.ThemeServiceModel,
        routes: [
            { path: ThemeEvents.Current, method: 'current' }
        ]
    };

    private dataService: ThemeDataService;

    constructor(serviceContainer: ServiceContainer, protected producer: Producer) {
        super(serviceContainer, producer);
        this.dataService = serviceContainer.resolve<ThemeDataService>(SERVICE_TYPES.ThemeDataService);
    }

    current() {
        this.producer.send(ThemeEvents.Current, this.dataService.current());
    }
}


