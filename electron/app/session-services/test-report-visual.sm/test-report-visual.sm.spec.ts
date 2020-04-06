import { SessionService } from "../session-service";
import { ServiceModelRoutes, Producer } from "../../pipeline";
import { VisualEvents, TestReportVisualsEvents } from '../../../../shared/events';
import { Session, Visual } from '../../../../shared/models';
import { VisualizationPlugin } from 'data-science-lab-core';
import { SERVICE_TYPES, ServiceContainer } from "../../service-container";
import { TestReportDataService } from "../../data-services/test-report-data-service";
import { VisualDataService } from "../../data-services/visual-data-service";
import { AlgorithmDataService } from "../../data-services/algorithm-data-service";

export class AlgorithmVisualServiceModel extends SessionService {
    static routes: ServiceModelRoutes = {
        service: SERVICE_TYPES.AlgorithmVisualServiceModel,
        routes: [
            { path: TestReportVisualsEvents.Create, method: 'create' },
            { path: TestReportVisualsEvents.Delete, method: 'delete' },
            { path: TestReportVisualsEvents.Select, method: 'select' },
            { path: TestReportVisualsEvents.Options, method: 'options' },
            { path: TestReportVisualsEvents.Command, method: 'command' },
            { path: TestReportVisualsEvents.Inputs, method: 'inputs' },
            { path: TestReportVisualsEvents.Previous, method: 'previous' },
        ]
    };

    private testReportService: TestReportDataService;
    private visualService: VisualDataService;
    private algorithmService: AlgorithmDataService;

    constructor(serviceContainer: ServiceContainer, producer: Producer) {
        super(serviceContainer, producer);

        this.testReportService = serviceContainer.resolve<TestReportDataService>(SERVICE_TYPES.TestReportDataService);
        this.visualService = serviceContainer.resolve<VisualDataService>(SERVICE_TYPES.VisualDataService);
        this.algorithmService = serviceContainer.resolve<AlgorithmDataService>(SERVICE_TYPES.AlgorithmDataService);
    }

    get eventCreate(): string {
        return TestReportVisualsEvents.Create;
    }

    get eventUpdate(): string {
        return TestReportVisualsEvents.Update;
    }

    get eventDelete(): string {
        return TestReportVisualsEvents.Delete;
    }

    get eventFinish(): string {
        return TestReportVisualsEvents.Finish;
    }

    get eventSelect(): string {
        return TestReportVisualsEvents.Select;
    }

    get eventOptions(): string {
        return TestReportVisualsEvents.Options;
    }

    get eventCommand(): string {
        return TestReportVisualsEvents.Command;
    }

    get eventInputs(): string {
        return TestReportVisualsEvents.Inputs;
    }

    get eventPrevious(): string {
        return TestReportVisualsEvents.Previous;
    }

    async pluginActivate(plugin: VisualizationPlugin) {

    }

    async sessionFinish(session: Session, plugin: VisualizationPlugin) {
        const report = this.testReportService.get(session.keyId);
        const algorithm = this.algorithmService.get(report.algorithmId);
        plugin.getInputs().submit(this.testReportService.extract(report.id, session.inputDict, session.selectedFeatures));        

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