import { TestReportVisualServiceModel } from "./test-report-visual.sm";
import { ServiceContainer, SERVICE_TYPES } from "../../service-container";
import { Producer } from "../../pipeline";
import { VisualDataService } from "../../data-services/visual-data-service";
import { AlgorithmDataService } from "../../data-services/algorithm-data-service";
import { Session } from "../../../../shared/models";
import { TestReportDataService } from "../../data-services/test-report-data-service";


describe('Electron Test Report Visual Service Model', () => {
    let serviceModel: TestReportVisualServiceModel;
    let serviceContainer: ServiceContainer;
    let producer: Producer;
    let visualService: VisualDataService;
    let testReportService: TestReportDataService;
    let algorithmService: AlgorithmDataService;

    beforeEach(() => {
        serviceContainer = jasmine.createSpyObj('ServiceContainer', ['resolve']);
        (serviceContainer.resolve as jasmine.Spy).and.callFake((type: SERVICE_TYPES) => {
            if (type === SERVICE_TYPES.VisualDataService) {
                return visualService;
            } else if (type === SERVICE_TYPES.TestReportDataService) {
                return testReportService;
            } else if (type === SERVICE_TYPES.AlgorithmDataService) {
                return algorithmService;
            }
            return undefined;
        });
        producer = jasmine.createSpyObj('Producer', ['send']);

        testReportService = jasmine.createSpyObj('TestReportDataService', ['get', 'extract']);
        algorithmService = jasmine.createSpyObj('AlgorithmDataService', ['get']);
        visualService = jasmine.createSpyObj('VisualService', ['post']);

        serviceModel = new TestReportVisualServiceModel(serviceContainer, producer);
    });

    it('session finish should submit options and post visuals', async () => {
        const plugin = jasmine.createSpyObj('VisualizationPlugion', ['getInputs', 'visualization']);
        (plugin.getInputs as jasmine.Spy).and.callFake(() => {
            return jasmine.createSpyObj('Options', ['submit']);
        });
        (testReportService.get as jasmine.Spy).and.returnValue({ algorithmId: 1 });
        (algorithmService.get as jasmine.Spy).and.returnValue({ experimentId: 1 });
        (visualService.post as jasmine.Spy).and.callFake((value) => value);
        await serviceModel.sessionFinish({} as Session, plugin);

        expect(producer.send).toHaveBeenCalledTimes(1);
        expect(plugin.visualization).toHaveBeenCalledTimes(1);
    });


});

