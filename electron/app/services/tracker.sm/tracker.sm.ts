import { SERVICE_TYPES, ServiceContainer } from '../../service-container';
import { ServiceModelRoutes, Producer } from '../../pipeline';
import { TrackerEvents } from '../../../../shared/events';
import { ServiceModel } from '../service-model';
import { TrackerDataService } from '../../data-services/tracker-data-service';


export class TrackerServiceModel extends ServiceModel {

    static routes: ServiceModelRoutes = {
        service: SERVICE_TYPES.TrackerServiceModel,
        routes: [
            { path: TrackerEvents.All, method: 'all' },
            { path: TrackerEvents.Change, method: 'change', isListener: true },
        ]
    };

    private trackerDatasetService: TrackerDataService;

    constructor(serviceContainer: ServiceContainer, producer: Producer) {
        super(serviceContainer, producer);

        this.trackerDatasetService = serviceContainer.resolve<TrackerDataService>(SERVICE_TYPES.TrackerDataService);
    }

    all() {
        this.producer.send(TrackerEvents.All, this.trackerDatasetService.allView());
    }

    change(id: number) {
        this.producer.send(TrackerEvents.Update, this.trackerDatasetService.view(id));
    }

}

