import { FetchServiceModel } from './fetch.sm';
import { ServiceContainer, SERVICE_TYPES } from '../../service-container';
import { Producer } from '../../pipeline';
import { DatasetDataService } from '../../data-services/dataset-data-service';
import { FileService } from 'data-science-lab-core';
import { Session } from '../../../../shared/models';


describe('Electron Fetch Service Model', () => {
    let serviceModel: FetchServiceModel;
    let serviceContainer: ServiceContainer;
    let producer: Producer;
    let datasetService: DatasetDataService;
    let fileService: FileService;

    beforeEach(() => {
        serviceContainer = jasmine.createSpyObj('ServiceContainer', ['resolve']);
        (serviceContainer.resolve as jasmine.Spy).and.callFake((type: SERVICE_TYPES) => {
            if (type === SERVICE_TYPES.FileService) {
                return fileService;
            } else if (type === SERVICE_TYPES.DatasetDataService) {
                return datasetService;
            }
            return undefined;
        });
        producer = jasmine.createSpyObj('Producer', ['send']);
        fileService = jasmine.createSpyObj('FileService', ['openFile']);
        datasetService = jasmine.createSpyObj('DatasetService', ['create', 'view']);

        serviceModel = new FetchServiceModel(serviceContainer, producer);
    });


    it('activate plugin should set file service', async () => {
        const plugin = jasmine.createSpyObj('FetchPlugin', ['setFileService']);

        await serviceModel.pluginActivate(plugin);

        expect(plugin.setFileService).toHaveBeenCalledTimes(1);
    });

    it('session finish should call producer three times', async () => {
        (datasetService.create as jasmine.Spy).and.callFake(() => {
            return [1, 2, 3];
        });
        const plugin = jasmine.createSpyObj('FetchPlugin', ['fetch']);
        const session = {
            keyId: 1
        };
        await serviceModel.sessionFinish(session as Session, plugin);

        expect(producer.send).toHaveBeenCalledTimes(3);
        expect(datasetService.view).toHaveBeenCalledTimes(3);
    });



});


