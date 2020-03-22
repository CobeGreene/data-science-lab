import { SessionService } from "../session-service";
import { ServiceModelRoutes, Producer } from "../../pipeline";
import { VisualEvents, DatasetVisualsEvents } from '../../../../shared/events';
import { Session, Visual } from '../../../../shared/models';
import { VisualizationPlugin } from 'data-science-lab-core';
import { SERVICE_TYPES, ServiceContainer } from "../../service-container";
import { VisualDataService } from '../../data-services/visual-data-service';
import { DatasetDataService } from "../../data-services/dataset-data-service";

export class DatasetVisualServiceModel extends SessionService {
    static routes: ServiceModelRoutes = {
        service: SERVICE_TYPES.DatasetVisualServiceModel,
        routes: [
            { path: DatasetVisualsEvents.Create, method: 'create' },
            { path: DatasetVisualsEvents.Delete, method: 'delete' },
            { path: DatasetVisualsEvents.Select, method: 'select' },
            { path: DatasetVisualsEvents.Options, method: 'options' },
            { path: DatasetVisualsEvents.Command, method: 'command' },
            { path: DatasetVisualsEvents.Inputs, method: 'inputs' },
            { path: DatasetVisualsEvents.Previous, method: 'previous' },
        ]
    };

    private visualService: VisualDataService;
    private datasetService: DatasetDataService;

    constructor(serviceContainer: ServiceContainer, producer: Producer) {
        super(serviceContainer, producer);

        this.visualService = serviceContainer.resolve<VisualDataService>(SERVICE_TYPES.VisualDataService);
        this.datasetService = serviceContainer.resolve<DatasetDataService>(SERVICE_TYPES.DatasetDataService);
    }

    get eventCreate(): string {
        return DatasetVisualsEvents.Create;
    }

    get eventUpdate(): string {
        return DatasetVisualsEvents.Update;
    }

    get eventDelete(): string {
        return DatasetVisualsEvents.Delete;
    }

    get eventFinish(): string {
        return DatasetVisualsEvents.Finish;
    }

    get eventSelect(): string {
        return DatasetVisualsEvents.Select;
    }

    get eventOptions(): string {
        return DatasetVisualsEvents.Options;
    }

    get eventCommand(): string {
        return DatasetVisualsEvents.Command;
    }

    get eventInputs(): string {
        return DatasetVisualsEvents.Inputs;
    }

    get eventPrevious(): string {
        return DatasetVisualsEvents.Previous;
    }

    async pluginActivate(plugin: VisualizationPlugin) {

    }

    async sessionFinish(session: Session, plugin: VisualizationPlugin) {
        const dataset = this.datasetService.get(session.keyId);
        plugin.getInputs().submit(this.datasetService.extract(dataset.id, session.inputDict, session.selectedFeatures));        

        const srcdoc = plugin.visualization();

        let visual: Visual = {
            id: 0,
            experimentId: dataset.experimentId,
            height: 3,
            width: 3,
            left: 0,
            top: 0,
            name: 'New Visual',
            srcdoc,
            zindex: 1
        }

        visual = this.visualService.post(visual);
        
        this.producer.send(VisualEvents.Create, visual);
    }

}