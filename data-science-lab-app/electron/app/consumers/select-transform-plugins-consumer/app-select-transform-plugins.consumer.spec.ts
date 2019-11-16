import { AppSelectTransformPluginsConsumer } from './app-select-transform-plugins.consumer';
import { MockServiceContainer, SERVICE_TYPES } from '../../services-container';
import { MockIpcService } from '../../../../shared/services';
import { MockSelectTransformPluginsService } from '../../services';
import { PackagesEvents, ExperimentsEvents } from '../../../../shared/events';
import { PluginPackage } from '../../../../shared/models';


describe('Electron App Select Transform Plugins Consumer Tests', () => {

    let consumer: AppSelectTransformPluginsConsumer;
    let serviceContainer: MockServiceContainer;
    let ipcService: MockIpcService;
    let transformService: MockSelectTransformPluginsService;

    beforeEach(() => {
        transformService = new MockSelectTransformPluginsService();
        ipcService = new MockIpcService();
        serviceContainer = new MockServiceContainer();
        serviceContainer.getType = (type: SERVICE_TYPES) => {
            switch (type) {
                case SERVICE_TYPES.SelectTransformPluginsService:
                    return transformService;
                case SERVICE_TYPES.IpcService:
                    return ipcService;
                default:
                    throw new Error(`Couldn't find type.`);
            }
        };
        consumer = new AppSelectTransformPluginsConsumer(serviceContainer);
        consumer.initialize();
    });

    it('get all event should call transform plugins service all', (done) => {
        transformService.all = () => {
            expect().nothing();
            done();
        };
        ipcService.send(ExperimentsEvents.GetAllTransformPluginsEvent);
    });

    it('install event should call transform plugins service install', (done) => {
        transformService.install = () => {
            expect().nothing();
            done();
        };
        ipcService.send(PackagesEvents.InstallListeners, new PluginPackage({
            name: 'name', repositoryName: 'repo', username: 'username',
            owner: 'owner'
        }));
    });

    it('uninstall event should call transform plugins service uninstall', (done) => {
        transformService.uninstall = () => {
            expect().nothing();
            done();
        };
        ipcService.send(PackagesEvents.UninstallListeners, new PluginPackage({
            name: 'name', repositoryName: 'repo', username: 'username',
            owner: 'owner'
        }));
    });

});
