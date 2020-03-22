import { TransformServiceModel } from './transform.sm';
import { ServiceContainer, SERVICE_TYPES } from '../../service-container';
import { Producer } from '../../pipeline';
import { DatasetDataService } from '../../data-services/dataset-data-service';
import { Session } from '../../../../shared/models';

describe('Electron Transform Service Model', () => {
    let serviceModel: TransformServiceModel;
    let serviceContainer: ServiceContainer;
    let producer: Producer;
    let datasetService: DatasetDataService;


    beforeEach(() => {
        serviceContainer = jasmine.createSpyObj('ServiceContainer', ['resolve']);
        (serviceContainer.resolve as jasmine.Spy).and.callFake((type: SERVICE_TYPES) => {
            if (type === SERVICE_TYPES.DatasetDataService) {
                return datasetService;
            }
            return undefined;
        });
        producer = jasmine.createSpyObj('Producer', ['send']);
        datasetService = jasmine.createSpyObj('DatasetService', ['get', 'transform', 'view', 'extract']);

        serviceModel = new TransformServiceModel(serviceContainer, producer);
    });

    it('transform should call producer send three times', async () => {
        const plugin = jasmine.createSpyObj('TransformPlugin', ['transform', 'getInputs']);
        (plugin.getInputs as jasmine.Spy).and.callFake(() => {
            const inputs = jasmine.createSpyObj('Input', ['submit']);
            return inputs;
        });
        (datasetService.transform as jasmine.Spy).and.callFake(() => {
            return { updateId: 1, createIds: [2, 3] };
        });
        (datasetService.get as jasmine.Spy).and.callFake(() => {
            return { id: 1 };
        });
        const session = {
            keyId: 1,
            selectedFeatures: [],
            inputDict: {}
        };

        await serviceModel.sessionFinish(session as Session, plugin);


        expect(producer.send).toHaveBeenCalledTimes(3);
        expect(datasetService.view).toHaveBeenCalledTimes(3);
    });
});

