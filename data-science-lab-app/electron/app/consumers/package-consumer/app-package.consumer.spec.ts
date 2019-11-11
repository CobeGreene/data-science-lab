import { AppPackageConsumer } from './app-package.consumer';
import { MockServiceContainer, SERVICE_TYPES } from '../../services-container';
import { MockIpcService } from '../../../../shared/services';
import { MockPackageService } from '../../services';
import { PackagesEvents } from '../../../../shared/events';
import { PluginPackage } from '../../../../shared/models';


describe('Electron App Package Consumer Tests', () => {

    let consumer: AppPackageConsumer;
    let serviceContainer: MockServiceContainer;
    let ipcService: MockIpcService;
    let packageService: MockPackageService;

    beforeEach(() => {
        packageService = new MockPackageService();
        ipcService = new MockIpcService();
        serviceContainer = new MockServiceContainer();
        serviceContainer.getType = (type: SERVICE_TYPES) => {
            switch (type) {
                case SERVICE_TYPES.PackageService:
                    return packageService;
                case SERVICE_TYPES.IpcService:
                    return ipcService;
                default:
                    throw new Error(`Couldn't find type.`);
            }
        };
        consumer = new AppPackageConsumer(serviceContainer);
        consumer.initialize();
    });

    it('get all event should call package service all', (done) => {
        packageService.all = () => {
            expect().nothing();
            done();
        };
        ipcService.send(PackagesEvents.GetAllEvent);
    });

    it('install event should call package service install', (done) => {
        packageService.install = () => {
            expect().nothing();
            done();
        };
        ipcService.send(PackagesEvents.InstallEvent, new PluginPackage({
            name: 'name', repositoryName: 'repo', username: 'username',
            owner: 'owner'
        }));
    });

    it('uninstall event should call package service uninstall', (done) => {
        packageService.uninstall = () => {
            expect().nothing();
            done();
        };
        ipcService.send(PackagesEvents.UninstallEvent, new PluginPackage({
            name: 'name', repositoryName: 'repo', username: 'username',
            owner: 'owner'
        }));
    });

});
