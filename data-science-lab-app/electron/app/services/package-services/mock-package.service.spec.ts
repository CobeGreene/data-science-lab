import { MockPackageService } from './mock-package.service';
import { PluginPackage, PluginPackageList } from '../../../../shared/models';
import { deserialize } from 'typescript-json-serializer';
import { PackagesEvents, ErrorEvents } from '../../../../shared/events';
import { MockIpService } from '../../../../shared/services';

describe('Electron Mock Package Service Tests', () => {
    let packageService: MockPackageService; 
    let ipService: MockIpService;
    let packagesList: PluginPackageList;

    beforeAll(() => {
        packagesList = new PluginPackageList([
            new PluginPackage({ name: 'first', owner: 'owner1', repositoryName: 'repo1', username: 'username'}),
            new PluginPackage({ name: 'second', owner: 'owner2', repositoryName: 'repo2', username: 'username'}),
            new PluginPackage({ name: 'third', owner: 'owner3', repositoryName: 'repo3', username: 'username', plugins: [], install: true}),
        ]);
        ipService = new MockIpService();
    });

    beforeEach(() => {
        const temp = new PluginPackageList(packagesList.packages.slice());
        packageService = MockPackageService.init(temp, ipService);
        packageService.inititalize();
    });

    afterEach(() => {
        packageService.destory();
        ipService.removeListenersFromAllChannels();
    });

    it('get all should retrieve arguments', (done) => {
        ipService.on(PackagesEvents.GetAllListeners, (_event, arg) => {
            expect(arg).toBeDefined();
            done();
        });
        ipService.send(PackagesEvents.GetAllEvent);
    });

    it('get all should retrieve plugins in json', (done) => {
        ipService.on(PackagesEvents.GetAllListeners, (_event, arg) => {
            const json = arg[0];
            const values = deserialize<PluginPackageList>(json, PluginPackageList);
            expect(values).toBeDefined();
            done();
        });
        ipService.send(PackagesEvents.GetAllEvent);
    });

    it('get all should retrieve packages of length packages', (done) => {
        ipService.on(PackagesEvents.GetAllListeners, (_event, arg) => {
            const json = arg[0];
            const values = deserialize<PluginPackageList>(json, PluginPackageList);
            expect(values.packages.length).toBe(packagesList.packages.length);
            done();
        });
        ipService.send(PackagesEvents.GetAllEvent);
    });

    it('install should return packages with first install', (done) => {
        ipService.on(PackagesEvents.GetAllListeners, (_event, arg) => {
            const values = deserialize<PluginPackageList>(arg[0], PluginPackageList);
            expect(values.packages[0].install).toBeTruthy();
            done();
        });
        ipService.send(PackagesEvents.InstallEvent, packagesList.packages[0].name);
    });

    it('install should retrieve error when can\'t find install', (done) => {
        ipService.on(ErrorEvents.ExceptionListeners, (_event, arg) => {
            const value = arg[0];
            expect(value).toBeDefined();
            done();
        });
        ipService.send(PackagesEvents.InstallEvent, 'not found');
    });

    it('install shold retrieve error when no arguments passed', (done) => {
        ipService.on(ErrorEvents.ExceptionListeners, (_event, arg) => {
            const value = arg[0];
            expect(value).toBeDefined();
            done();
        });
        ipService.send(PackagesEvents.InstallEvent);
    });

    it('uninstall should return packages when third uninstall', (done) => {
        ipService.on(PackagesEvents.GetAllListeners, (_event, arg) => {
            const values = deserialize<PluginPackageList>(arg[0], PluginPackageList);
            expect(values.packages[2].install).toBeFalsy();
            done();
        });
        ipService.send(PackagesEvents.UninstallEvent, packagesList.packages[2].name);
    });

    it('uninstall should retrieve error when can\'t find name', (done) => {
        ipService.on(ErrorEvents.ExceptionListeners, (_event, arg) => {
            const value = arg[0];
            expect(value).toBeDefined();
            done();
        });
        ipService.send(PackagesEvents.UninstallEvent, 'not found');
    });

    it('uninstall should retrieve error when no arguments passed', (done) => {
        ipService.on(ErrorEvents.ExceptionListeners, (_event, arg) => {
            const value = arg[0];
            expect(value).toBeDefined();
            done();
        });
        ipService.send(PackagesEvents.UninstallEvent);
    });
    
});
