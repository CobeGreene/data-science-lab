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
            { path: DatasetEvents.Rename, method: 'rename' },
            { path: DatasetEvents.Split, method: 'split' },
            { path: ExperimentEvents.Load, method: 'load' },
            { path: ExperimentEvents.Save, method: 'save', isListener: true },
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

    rename(id: number, name: string) {
        const dataset = this.datasetService.get(id);
        dataset.name = name;
        this.datasetService.update(dataset);
        this.producer.send(DatasetEvents.Update, this.datasetService.view(id));
    }

    load(experimentId: number) {
        this.datasetService.load(experimentId);
        this.producer.send(DatasetEvents.All, this.datasetService.all());
    }

    save(experimentId: number) {
        this.datasetService.save(experimentId);
    }

    split(id: number, split: number) {
        const splitId = this.datasetService.split(id, split);
        this.producer.send(DatasetEvents.Update, this.datasetService.view(id));
        this.producer.send(DatasetEvents.Create, this.datasetService.view(splitId));
    }
}

