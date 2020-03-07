import { SessionService } from "../session-service";
import { ServiceModelRoutes, Producer } from "../../pipeline";
import { VisualEvents, AlgorithmVisualsEvents } from '../../../../shared/events';
import { Session, Visual } from '../../../../shared/models';
import { VisualizationPlugin } from 'data-science-lab-core';
import { SERVICE_TYPES, ServiceContainer } from "../../service-container";
import { VisualDataService } from '../../data-services/visual-data-service';
import { TrackerDataService } from "../../data-services/tracker-data-service";
import { AlgorithmDataService } from "../../data-services/algorithm-data-service";

export class AlgorithmVisualServiceModel extends SessionService {
    static routes: ServiceModelRoutes = {
        service: SERVICE_TYPES.DatasetVisualServiceModel,
        routes: [
            { path: AlgorithmVisualsEvents.Create, method: 'create' },
            { path: AlgorithmVisualsEvents.Delete, method: 'delete' },
            { path: AlgorithmVisualsEvents.Select, method: 'select' },
            { path: AlgorithmVisualsEvents.Options, method: 'options' },
            { path: AlgorithmVisualsEvents.Command, method: 'command' },
            { path: AlgorithmVisualsEvents.Inputs, method: 'inputs' },
            { path: AlgorithmVisualsEvents.Previous, method: 'previous' },
        ]
    };

    private visualService: VisualDataService;
    private trackerService: TrackerDataService;
    private algorithmService: AlgorithmDataService;

    constructor(serviceContainer: ServiceContainer, producer: Producer) {
        super(serviceContainer, producer);

        this.visualService = serviceContainer.resolve<VisualDataService>(SERVICE_TYPES.VisualDataService);
        this.trackerService = serviceContainer.resolve<TrackerDataService>(SERVICE_TYPES.TrackerDataService);
        this.algorithmService = serviceContainer.resolve<AlgorithmDataService>(SERVICE_TYPES.AlgorithmDataService);
    }

    get eventCreate(): string {
        return AlgorithmVisualsEvents.Create;
    }

    get eventUpdate(): string {
        return AlgorithmVisualsEvents.Update;
    }

    get eventDelete(): string {
        return AlgorithmVisualsEvents.Delete;
    }

    get eventFinish(): string {
        return AlgorithmVisualsEvents.Finish;
    }

    get eventSelect(): string {
        return AlgorithmVisualsEvents.Select;
    }

    get eventOptions(): string {
        return AlgorithmVisualsEvents.Options;
    }

    get eventCommand(): string {
        return AlgorithmVisualsEvents.Command;
    }

    get eventInputs(): string {
        return AlgorithmVisualsEvents.Inputs;
    }

    get eventPrevious(): string {
        return AlgorithmVisualsEvents.Previous;
    }

    async pluginActivate(plugin: VisualizationPlugin) {

    }

    async sessionFinish(session: Session, plugin: VisualizationPlugin) {
        const tracker = this.trackerService.get(session.keyId);
        const algorithm = this.algorithmService.get(tracker.algorithmId);
        plugin.getInputs().submit(this.trackerService.extract(tracker.algorithmId, session.inputDict));        

        const srcdoc = plugin.visualization();

        let visual: Visual = {
            id: 0,
            experimentId: algorithm.experimentId,
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