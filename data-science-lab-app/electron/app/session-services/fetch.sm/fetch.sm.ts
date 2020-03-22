import { SERVICE_TYPES, ServiceContainer } from '../../service-container';
import { ServiceModelRoutes, Producer } from '../../pipeline';
import { FetchEvents, DatasetEvents } from '../../../../shared/events';
import { Session } from '../../../../shared/models';
import { FetchPlugin, FileService } from 'data-science-lab-core';
import { DatasetDataService } from '../../data-services/dataset-data-service';
import { SessionService } from '../session-service';

export class FetchServiceModel extends SessionService {
    static routes: ServiceModelRoutes = {
        service: SERVICE_TYPES.FetchServiceModel,
        routes: [
            { path: FetchEvents.Create, method: 'create' },
            { path: FetchEvents.Delete, method: 'delete' },
            { path: FetchEvents.Select, method: 'select' },
            { path: FetchEvents.Options, method: 'options' },
            { path: FetchEvents.Command, method: 'command' },
            { path: FetchEvents.Previous, method: 'previous' },
        ]
    };

    private datasetService: DatasetDataService;

    private get fileService(): FileService {
        return this.serviceContainer.resolve<FileService>(SERVICE_TYPES.FileService);
    }

    constructor(serviceContainer: ServiceContainer, producer: Producer) {
        super(serviceContainer, producer);

        this.datasetService = serviceContainer.resolve<DatasetDataService>(SERVICE_TYPES.DatasetDataService);
    }

    get eventCreate(): string {
        return FetchEvents.Create;
    }

    get eventUpdate(): string {
        return FetchEvents.Update;
    }

    get eventDelete(): string {
        return FetchEvents.Delete;
    }

    get eventFinish(): string {
        return FetchEvents.Finish;
    }

    get eventSelect(): string {
        return FetchEvents.Select;
    }

    get eventOptions(): string {
        return FetchEvents.Options;
    }

    get eventCommand(): string {
        return FetchEvents.Command;
    }

    get eventInputs(): string {
        throw new Error(`Fetch Event Input doesn't exists`);
    }

    get eventPrevious(): string {
        return FetchEvents.Previous;
    }

    async pluginActivate(plugin: FetchPlugin) {
        plugin.setFileService(this.fileService);
    }

    async sessionFinish(session: Session, plugin: FetchPlugin) {
        const data = plugin.fetch();
        const ids = this.datasetService.create(session.keyId, data);
        ids.forEach(id => {
            const view = this.datasetService.view(id);
            this.producer.send(DatasetEvents.Create, view);
        });
    }

}
