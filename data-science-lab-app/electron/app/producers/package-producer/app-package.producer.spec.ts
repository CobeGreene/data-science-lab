import { AppPackageProducer } from './app-package.producer';
import { MockServiceContainer, SERVICE_TYPES } from '../../services-container';
import { MockIpcService } from '../../../../shared/services';
import { PackagesEvents, ErrorEvents } from '../../../../shared/events';
import { PluginPackage, PluginPackageList } from '../../../../shared/models';


describe('Electron App Package Producer Tests', () => {

    let producer: AppPackageProducer;
    let serviceContainer: MockServiceContainer;
    let ipcService: MockIpcService;

    beforeEach(() => {
        ipcService = new MockIpcService();
        serviceContainer = new MockServiceContainer();
        serviceContainer.getType = (type: SERVICE_TYPES) => {
            switch (type) {
                case SERVICE_TYPES.IpcService:
                    return ipcService;
                default:
                    throw new Error(`Couldn't find type.`);
            }
        };

        producer = new AppPackageProducer(serviceContainer);
    });

    it('all should call get all listeners', (done) => {
        ipcService.on(PackagesEvents.GetAllListeners, () => {
            expect().nothing();
            done();
        });
        producer.all(new PluginPackageList([]));
    });

    
    it('install should call install listeners', (done) => {
        ipcService.on(PackagesEvents.InstallListeners, () => {
            expect().nothing();
            done();
        });
        producer.install(new PluginPackage({
            name: 'name', owner: 'owner', repositoryName: 'repo',
            username: 'username',
        }));
    });

    it('uninstall should call uninstall listeners', (done) => {
        ipcService.on(PackagesEvents.UninstallListeners, () => {
            expect().nothing();
            done();
        });
        producer.uninstall(new PluginPackage({
            name: 'name', owner: 'owner', repositoryName: 'repo',
            username: 'username',
        }));
    });

    it('error should call error listeners', (done) => {
        ipcService.on(ErrorEvents.ExceptionListeners, () => {
            expect().nothing();
            done();
        });
        producer.error('error');
    });

});
