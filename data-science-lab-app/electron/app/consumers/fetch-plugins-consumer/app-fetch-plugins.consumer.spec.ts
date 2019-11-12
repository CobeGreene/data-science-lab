import { MockServiceContainer, SERVICE_TYPES } from '../../services-container';
import { IpcService, MockIpcService } from '../../../../shared/services';
import { ExperimentsEvents, PackagesEvents } from '../../../../shared/events';
import { MockFetchPluginsService } from '../../services';
import { AppFetchPluginsConsumer } from './app-fetch-plugins.consumer';


describe('Electron App Fetch Plugins Consumer Tests', () => {

    let consumer: AppFetchPluginsConsumer;
    let serviceContainer: MockServiceContainer;
    let ipcService: MockIpcService;
    let service: MockFetchPluginsService;

    beforeEach(() => {
        service = new MockFetchPluginsService();
        ipcService = new MockIpcService();
        serviceContainer = new MockServiceContainer();
        serviceContainer.getType = (type: SERVICE_TYPES) => {
            switch (type) {
                case SERVICE_TYPES.FetchPluginsService:
                    return service;
                case SERVICE_TYPES.IpcService:
                    return ipcService;
                default:
                    throw new Error(`Couldn't find type.`);
            }
        };
        consumer = new AppFetchPluginsConsumer(serviceContainer);
        consumer.initialize();
    });

    it('get all event should call all on service', (done) => {
        service.all = () => {
            expect().nothing();
            done();
        };
        ipcService.send(ExperimentsEvents.GetAllFetchPluginsEvent);
    });

    it('package install should call all on service', (done) => {
        service.all = () => {
            expect().nothing();
            done();
        };
        ipcService.send(PackagesEvents.InstallListeners);
    });
    
    it('package uninstall should call all on service', (done) => {
        service.all = () => {
            expect().nothing();
            done();
        };
        ipcService.send(PackagesEvents.UninstallListeners);
    });

});
