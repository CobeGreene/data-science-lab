import { ServiceContainer, SERVICE_TYPES } from "../../service-container";
import { Producer } from "../../pipeline";
import { VisualDataService } from "../../data-services/visual-data-service";
import { TrackerDataService } from "../../data-services/tracker-data-service";
import { AlgorithmDataService } from "../../data-services/algorithm-data-service";
import { Session } from "../../../../shared/models";
import { VisualEvents } from "../../../../shared/events";
import { DatasetVisualServiceModel } from "./dataset-visual.sm";
import { DatasetDataService } from "../../data-services/dataset-data-service";




describe('Electron Algorithm Visual Service Model', () => {
    let serviceModel: DatasetVisualServiceModel;
    let serviceContainer: ServiceContainer;
    let producer: Producer;
    let visualService: VisualDataService;
    let datasetService: DatasetDataService;

    beforeEach(() => {
        serviceContainer = jasmine.createSpyObj('ServiceContainer', ['resolve']);
        (serviceContainer.resolve as jasmine.Spy).and.callFake((type: SERVICE_TYPES) => {
            if (type === SERVICE_TYPES.VisualDataService) {
                return visualService;
            } else if (type === SERVICE_TYPES.DatasetDataService) {
                return datasetService;
            }
            return undefined;
        });
        producer = jasmine.createSpyObj('Producer', ['send']);

        datasetService = jasmine.createSpyObj('DatasetDataService', ['get', 'extract']);
        visualService = jasmine.createSpyObj('VisualService', ['post']);

        serviceModel = new DatasetVisualServiceModel(serviceContainer, producer);
    });

    it('session finish should submit options and post visuals', async () => {
        const plugin = jasmine.createSpyObj('VisualizationPlugion', ['getInputs', 'visualization']);
        (plugin.getInputs as jasmine.Spy).and.callFake(() => {
            return jasmine.createSpyObj('Options', ['submit']);
        });
        (datasetService.get as jasmine.Spy).and.returnValue({ experimentId: 1 });
        (visualService.post as jasmine.Spy).and.callFake((value) => value);
        await serviceModel.sessionFinish({} as Session, plugin);

        expect(producer.send).toHaveBeenCalledTimes(1);
        expect(plugin.visualization).toHaveBeenCalledTimes(1);
    });

    
    it('session inputs should call extract', async () => {
        const options = jasmine.createSpyObj('Options', ['submit']); 
        const plugin = jasmine.createSpyObj('VisualizationPlugion', ['getInputs']);
        (plugin.getInputs as jasmine.Spy).and.callFake(() => {
            return options;
        });
        (datasetService.get as jasmine.Spy).and.returnValue({ id: 1 });
        (datasetService.extract as jasmine.Spy).and.returnValue({});
        await serviceModel.sessionInputs({} as Session, plugin);

        expect(options.submit).toHaveBeenCalledTimes(1);
        expect(datasetService.extract).toHaveBeenCalledTimes(1);
    });


});

