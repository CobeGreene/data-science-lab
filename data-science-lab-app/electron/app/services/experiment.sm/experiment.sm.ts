import { SERVICE_TYPES, ServiceContainer, Service } from '../../service-container';
import { ServiceModelRoutes, Producer,  } from '../../pipeline';
import { ExperimentEvents } from '../../../../shared/events';
import { ServiceModel  } from '../service-model';

export class ExperimentServiceModel extends ServiceModel {
    static routes: ServiceModelRoutes = {
        service: SERVICE_TYPES.ExperimentServiceModel,
        routes: [
            // { path: ExperimentEvents.All, method: 'all' },
            // { path: ExperimentEvents.Get, method: 'get' },
            // { path: ExperimentEvents.Create, method: 'post' },
            // { path: ExperimentEvents.Delete, method: 'del' },
            // { path: ExperimentEvents.Update, method: 'put' },
        ]
    };
}
