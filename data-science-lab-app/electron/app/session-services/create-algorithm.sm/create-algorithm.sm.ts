import { SERVICE_TYPES, ServiceContainer } from '../../service-container';
import { ServiceModelRoutes, Producer } from '../../pipeline';
import { AlgorithmCreateEvents, AlgorithmEvents } from '../../../../shared/events';
import { Session } from '../../../../shared/models';
import { AlgorithmPlugin } from 'data-science-lab-core';
import { SessionService } from '../session-service';
import { AlgorithmDataService } from '../../data-services/algorithm-data-service';
import { DatasetDataService } from '../../data-services/dataset-data-service';

export class CreateAlgorithmServiceModel extends SessionService {
    static routes: ServiceModelRoutes = {
        service: SERVICE_TYPES.CreateAlgorithmServiceModel,
        routes: [
            { path: AlgorithmCreateEvents.Create, method: 'create' },
            { path: AlgorithmCreateEvents.Delete, method: 'delete' },
            { path: AlgorithmCreateEvents.Select, method: 'select' },
            { path: AlgorithmCreateEvents.Options, method: 'options' },
            { path: AlgorithmCreateEvents.Command, method: 'command' },
            { path: AlgorithmCreateEvents.Inputs, method: 'inputs' },
            { path: AlgorithmCreateEvents.Previous, method: 'previous' },
        ]
    };

    private algorithmService: AlgorithmDataService;
    private datasetService: DatasetDataService;

    constructor(serviceContainer: ServiceContainer, producer: Producer) {
        super(serviceContainer, producer);

        this.algorithmService = this.serviceContainer.resolve<AlgorithmDataService>(SERVICE_TYPES.AlgorithmDataService);
        this.datasetService = this.serviceContainer.resolve<DatasetDataService>(SERVICE_TYPES.DatasetDataService);
    }

    get eventCreate(): string {
        return AlgorithmCreateEvents.Create;
    }

    get eventUpdate(): string {
        return AlgorithmCreateEvents.Update;
    }

    get eventDelete(): string {
        return AlgorithmCreateEvents.Delete;
    }

    get eventFinish(): string {
        return AlgorithmCreateEvents.Finish;
    }

    get eventSelect(): string {
        return AlgorithmCreateEvents.Select;
    }

    get eventOptions(): string {
        return AlgorithmCreateEvents.Options;
    }

    get eventCommand(): string {
        return AlgorithmCreateEvents.Command;
    }

    get eventInputs(): string {
        return AlgorithmCreateEvents.Inputs;
    }

    get eventPrevious(): string {
        return AlgorithmCreateEvents.Previous;
    }

    async pluginActivate(plugin: AlgorithmPlugin) {
        
    }   

    async sessionFinish(session: Session, plugin: AlgorithmPlugin) {
        const dataset = this.datasetService.get(session.keyId);
        plugin.getInputs().submit(this.datasetService.extract(dataset.id, session.inputDict));   
        plugin.initialize();
        const id = this.algorithmService.create(dataset.experimentId, session.plugin, plugin);
        this.producer.send(AlgorithmEvents.Create, this.algorithmService.view(id));
    }
}


