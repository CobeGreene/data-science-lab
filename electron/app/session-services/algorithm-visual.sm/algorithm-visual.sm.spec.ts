import { AlgorithmVisualServiceModel } from "./algorithm-visual.sm";
import { ServiceContainer, SERVICE_TYPES } from "../../service-container";
import { Producer } from "../../pipeline";
import { VisualDataService } from "../../data-services/visual-data-service";
import { TrackerDataService } from "../../data-services/tracker-data-service";
import { AlgorithmDataService } from "../../data-services/algorithm-data-service";
import { Session } from "../../../../shared/models";
import { VisualEvents } from "../../../../shared/events";




describe('Electron Algorithm Visual Service Model', () => {
    let serviceModel: AlgorithmVisualServiceModel;
    let serviceContainer: ServiceContainer;
    let producer: Producer;
    let visualService: VisualDataService;
    let trackerService: TrackerDataService;
    let algorithmService: AlgorithmDataService;

    beforeEach(() => {
        serviceContainer = jasmine.createSpyObj('ServiceContainer', ['resolve']);
        (serviceContainer.resolve as jasmine.Spy).and.callFake((type: SERVICE_TYPES) => {
            if (type === SERVICE_TYPES.VisualDataService) {
                return visualService;
            } else if (type === SERVICE_TYPES.TrackerDataService) {
                return trackerService;
            } else if (type === SERVICE_TYPES.AlgorithmDataService) {
                return algorithmService;
            }
            return undefined;
        });
        producer = jasmine.createSpyObj('Producer', ['send']);
        visualService = jasmine.createSpyObj('VisualService', ['get', 'transform', 'view', 'extract']);

        trackerService = jasmine.createSpyObj('TrackerDataService', ['get', 'extract']);
        algorithmService = jasmine.createSpyObj('AlgorithmDataService', ['get']);
        visualService = jasmine.createSpyObj('VisualService', ['post']);

        serviceModel = new AlgorithmVisualServiceModel(serviceContainer, producer);
    });

    it('session finish should submit options and post visuals', async () => {
        const plugin = jasmine.createSpyObj('VisualizationPlugion', ['getInputs', 'visualization']);
        (plugin.getInputs as jasmine.Spy).and.callFake(() => {
            return jasmine.createSpyObj('Options', ['submit']);
        });
        (trackerService.get as jasmine.Spy).and.returnValue({ algorithmId: 1 });
        (algorithmService.get as jasmine.Spy).and.returnValue({ experimentId: 1 });
        (visualService.post as jasmine.Spy).and.callFake((value) => value);
        await serviceModel.sessionFinish({} as Session, plugin);

        expect(producer.send).toHaveBeenCalledTimes(1);
        expect(plugin.visualization).toHaveBeenCalledTimes(1);
    });


});

