import { SERVICE_TYPES, ServiceContainer } from '../../service-container';
import { ServiceModelRoutes, Producer } from '../../pipeline';
import { TransformEvents, DatasetEvents } from '../../../../shared/events';
import { Session } from '../../../../shared/models';
import { TransformPlugin } from 'data-science-lab-core';
import { DatasetDataService } from '../../data-services/dataset-data-service';
import { SessionService } from '../session-service';

export class TransformServiceModel extends SessionService {
    static routes: ServiceModelRoutes = {
        service: SERVICE_TYPES.TransformServiceModel,
        routes: [
            { path: TransformEvents.Create, method: 'create' },
            { path: TransformEvents.Delete, method: 'delete' },
            { path: TransformEvents.Select, method: 'select' },
            { path: TransformEvents.Options, method: 'options' },
            { path: TransformEvents.Command, method: 'command' },
            { path: TransformEvents.Inputs, method: 'inputs' },
            { path: TransformEvents.Previous, method: 'previous' },
        ]
    };

    private datasetService: DatasetDataService;

    constructor(serviceContainer: ServiceContainer, producer: Producer) {
        super(serviceContainer, producer);

        this.datasetService = serviceContainer.resolve<DatasetDataService>(SERVICE_TYPES.DatasetDataService);
    }
    get eventCreate(): string {
        return TransformEvents.Create;
    }

    get eventUpdate(): string {
        return TransformEvents.Update;
    }

    get eventDelete(): string {
        return TransformEvents.Delete;
    }

    get eventFinish(): string {
        return TransformEvents.Finish;
    }

    get eventSelect(): string {
        return TransformEvents.Select;
    }

    get eventOptions(): string {
        return TransformEvents.Options;
    }

    get eventCommand(): string {
        return TransformEvents.Command;
    }

    get eventInputs(): string {
        return TransformEvents.Inputs;
    }

    get eventPrevious(): string {
        return TransformEvents.Previous;
    }

    async pluginActivate(plugin: TransformPlugin) {
    }

    async sessionInputs(session: Session, plugin: TransformPlugin) {
        const dataset = this.datasetService.get(session.keyId);
        plugin.getInputs().submit(this.datasetService.extract(dataset.id, session.inputDict, session.selectedFeatures));
    }

    async sessionFinish(session: Session, plugin: TransformPlugin) {
        const dataset = this.datasetService.get(session.keyId);
        const pluginData = plugin.transform();
        const { updateId, createIds } = this.datasetService.transform(dataset.id, pluginData, session.selectedFeatures);

        this.producer.send(DatasetEvents.Update, this.datasetService.view(updateId));
        
        createIds.forEach((id) => {
            this.producer.send(DatasetEvents.Create, this.datasetService.view(id));
        });

    }
}


