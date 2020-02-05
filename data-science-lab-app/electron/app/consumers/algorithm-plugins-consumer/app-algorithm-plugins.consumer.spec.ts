import { AppAlgorithmPluginsConsumer } from './app-algorithm-plugins.consumer';
import { MockServiceContainer, SERVICE_TYPES } from '../../services-container';
import { MockIpcService } from '../../../../shared/services';
import { MockAlgorithmPluginsService } from '../../services';
import { PackagesEvents, ExperimentsEvents } from '../../../../shared/events';
import { PluginPackage } from '../../../../shared/models';


describe('Electron App Algorithm Plugins Consumer Tests', () => {

    let consumer: AppAlgorithmPluginsConsumer;
    let serviceContainer: MockServiceContainer;
    let ipcService: MockIpcService;
    let mockService: MockAlgorithmPluginsService;

    beforeEach(() => {
        mockService = new MockAlgorithmPluginsService();
        ipcService = new MockIpcService();
        serviceContainer = new MockServiceContainer();
        serviceContainer.getType = (type: SERVICE_TYPES) => {
            switch (type) {
                case SERVICE_TYPES.AlgorithmPluginsService:
                    return mockService;
                case SERVICE_TYPES.IpcService:
                    return ipcService;
                default:
                    throw new Error(`Couldn't find type.`);
            }
        };
        consumer = new AppAlgorithmPluginsConsumer(serviceContainer);
        consumer.initialize();
    });

    it('get all event should call algorithm plugins service all', (done) => {
        mockService.all = () => {
            expect().nothing();
            done();
        };
        ipcService.send(ExperimentsEvents.GetAllAlgorithmPluginsEvent);
    });

    it('install event should call algorithm plugins service install', (done) => {
        mockService.install = () => {
            expect().nothing();
            done();
        };
        ipcService.send(PackagesEvents.InstallListeners, new PluginPackage({
            name: 'name', repositoryName: 'repo', username: 'username',
            owner: 'owner'
        }));
    });

    it('uninstall event should call algorithm plugins service uninstall', (done) => {
        mockService.uninstall = () => {
            expect().nothing();
            done();
        };
        ipcService.send(PackagesEvents.UninstallListeners, new PluginPackage({
            name: 'name', repositoryName: 'repo', username: 'username',
            owner: 'owner'
        }));
    });

});
