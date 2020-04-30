import { CreateAlgorithmServiceModel } from './create-algorithm.sm';
import { ServiceContainer, SERVICE_TYPES } from '../../service-container';
import { Producer } from '../../pipeline';
import { DatasetDataService } from '../../data-services/dataset-data-service';
import { AlgorithmDataService } from '../../data-services/algorithm-data-service';
import { Session } from '../../../../shared/models';
import { AlgorithmEvents } from '../../../../shared/events';

describe('Electron Transform Service Model', () => {
    let serviceModel: CreateAlgorithmServiceModel;
    let serviceContainer: ServiceContainer;
    let producer: Producer;
    let datasetService: DatasetDataService;
    let algorithmService: AlgorithmDataService;


    beforeEach(() => {
        serviceContainer = jasmine.createSpyObj('ServiceContainer', ['resolve']);
        (serviceContainer.resolve as jasmine.Spy).and.callFake((type: SERVICE_TYPES) => {
            if (type === SERVICE_TYPES.DatasetDataService) {
                return datasetService;
            } else if (type === SERVICE_TYPES.AlgorithmDataService) {
                return algorithmService;
            }
            return undefined;
        });
        producer = jasmine.createSpyObj('Producer', ['send']);
        datasetService = jasmine.createSpyObj('DatasetDataService', ['get', 'extract']);
        algorithmService = jasmine.createSpyObj('AlgorithmDataService', ['create', 'view']);

        serviceModel = new CreateAlgorithmServiceModel(serviceContainer, producer);
    });

    it('algorithm should call view with created id.', async (done) => {
        const plugin = jasmine.createSpyObj('AlgorithmPlugin', ['initialize', 'getInputs']);
        (plugin.getInputs as jasmine.Spy).and.callFake(() => {
            const inputs = jasmine.createSpyObj('Input', ['submit']);
            return inputs;
        });
        (datasetService.get as jasmine.Spy).and.callFake(() => {
            return { id: 1, experimentId: 1, };
        });
        const session = {
            keyId: 1,
            selectedFeatures: [],
            inputDict: {},
            plugin: {}
        };
        (algorithmService.create as jasmine.Spy).and.callFake(() => {
            return 3;
        });
        (algorithmService.view as jasmine.Spy).and.callFake((value) => {
            return { id: value };
        });

        (producer.send as jasmine.Spy).and.callFake((event, value) => {
            expect(event).toBe(AlgorithmEvents.Create);
            expect(value.id).toBe(3);
            done();
        });

        await serviceModel.sessionFinish(session as Session, plugin);
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

