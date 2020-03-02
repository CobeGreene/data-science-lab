import { SERVICE_TYPES, ServiceContainer } from '../../service-container';
import { ServiceModelRoutes, Producer, } from '../../pipeline';
import { ExperimentEvents, DatasetEvents } from '../../../../shared/events';
import { ServiceModel } from '../service-model';
import { DatasetDataService } from '../../data-services/dataset-data-service';

export class DatasetServiceModel extends ServiceModel {
    static routes: ServiceModelRoutes = {
        service: SERVICE_TYPES.DatasetServiceModel,
        routes: [
            { path: DatasetEvents.All, method: 'all' },
            { path: DatasetEvents.Delete, method: 'delete' },
            { path: ExperimentEvents.Load, method: 'load' },
            { path: ExperimentEvents.Save, method: 'save', isListener: true },
            // { path: ExperimentEvents.Delete, method: 'experimentDelete' },
        ]
    };

    private datasetService: DatasetDataService;

    constructor(serviceContainer: ServiceContainer, producer: Producer) {
        super(serviceContainer, producer);
        this.datasetService = serviceContainer.resolve<DatasetDataService>(SERVICE_TYPES.DatasetDataService);
    }

    all() {
        this.producer.send(DatasetEvents.All, this.datasetService.all());
    }

    delete(id: number) {
        this.datasetService.delete(id);
        this.producer.send(DatasetEvents.Delete, id);
    }

    load(experimentId: number) {
        this.datasetService.load(experimentId);
        this.producer.send(DatasetEvents.All, this.datasetService.all());
    }

    save(experimentId: number) {
        this.datasetService.save(experimentId);
    }
}

