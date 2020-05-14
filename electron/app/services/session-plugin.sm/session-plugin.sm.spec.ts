import { ServiceContainer, SERVICE_TYPES } from '../../service-container';
import { Producer } from '../../pipeline';
import { SessionPluginServiceModel } from './session-plugin.sm';
import { PackageEvents, ErrorEvent } from '../../../../shared/events';
import { SessionPluginDataService } from '../../data-services/session-plugin-data-service';
import { Package } from '../../../../shared/models';

describe('Electron Session Plugin Service Model', () => {
    let serviceModel: SessionPluginServiceModel;
    let serviceContainer: ServiceContainer;
    let dataService: SessionPluginDataService;
    let producer: Producer;

    beforeEach(() => {
        serviceContainer = jasmine.createSpyObj('ServiceContainer', ['resolve']);
        (serviceContainer.resolve as jasmine.Spy).and.callFake((type: SERVICE_TYPES) => {
            if (type === SERVICE_TYPES.SessionPluginDataService) {
                return dataService;
            } 
            throw new Error(`Couldn't resolve type ${type}.`);
        });
        producer = jasmine.createSpyObj('Producer', ['send']);
        dataService = jasmine.createSpyObj('PackageDataService', ['all', 'install', 'uninstall']);
        serviceModel = new SessionPluginServiceModel(serviceContainer, producer); 
    });

    it('all should producer session all', () => {
        serviceModel.all();

        expect(dataService.all).toHaveBeenCalledTimes(1);
        expect(producer.send).toHaveBeenCalledTimes(1);
    });
    it('install should producer session all', async () => {
        (dataService.install as jasmine.Spy).and.callFake(() => {
            return new Promise<void>((resolve) => resolve());
        });
        await serviceModel.install({

        } as any);

        expect(dataService.all).toHaveBeenCalledTimes(1);
        expect(dataService.install).toHaveBeenCalledTimes(1);
        expect(producer.send).toHaveBeenCalledTimes(1);
    });
    it('uninstall should producer session all', async () => {
        (dataService.uninstall as jasmine.Spy).and.callFake(() => {
            return new Promise<void>((resolve) => resolve());
        });
        await serviceModel.uninstall({

        } as any);

        expect(dataService.all).toHaveBeenCalledTimes(1);
        expect(dataService.uninstall).toHaveBeenCalledTimes(1);
        expect(producer.send).toHaveBeenCalledTimes(1);
    });
    
});
