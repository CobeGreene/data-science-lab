import { MockZone } from '../mock-zone';
import { AppPackageService } from './app-package.service';
import { PluginPackageList, PluginPackage } from '../../../../shared/models';
import { PackagesEvents } from '../../../../shared/events';
import { MockIpcService } from '../../../../shared/services';

describe('Angular App Package Service Tests', () => {
    let packageService: AppPackageService;
    let ipcService: MockIpcService;
    let packagesList: PluginPackageList;
    let zone: MockZone;

    const getAllEvent = (event, arg): void => {
        const json = JSON.stringify(packagesList);
        ipcService.send(PackagesEvents.GetAllListeners, json);
    };

    const installEvent = (event, arg): void => {
        const name = arg[0];
        const find = packagesList.packages.findIndex((value: PluginPackage) => {
            return value.name === name;
        });
        if (find >= 0) {
            packagesList.packages[find].install = true;
            const json = JSON.stringify(packagesList);
            ipcService.send(PackagesEvents.GetAllListeners, json);
        }
    };

    const uninstallEvent = (event, arg): void => {
        const name = arg[0];
        const find = packagesList.packages.findIndex((value: PluginPackage) => {
            return value.name === name;
        });
        if (find >= 0) {
            packagesList.packages[find].install = false;
            const json = JSON.stringify(packagesList);
            ipcService.send(PackagesEvents.GetAllListeners, json);
        }
    };

    beforeAll(() => {
        packagesList = new PluginPackageList([
            new PluginPackage({ name: 'first', owner: 'owner1', repositoryName: 'reop1', username: 'user1' }),
            new PluginPackage({ name: 'second', owner: 'owner2', repositoryName: 'reop2', username: 'user2' }),
            new PluginPackage({ name: 'third', owner: 'owner3', repositoryName: 'reop3', username: 'user3', plugins: [], install: false })
        ]);
        zone = new MockZone({});
        ipcService = new MockIpcService();
    });

    beforeEach(() => {
        ipcService.on(PackagesEvents.GetAllEvent, getAllEvent);
        ipcService.on(PackagesEvents.InstallEvent, installEvent);
        ipcService.on(PackagesEvents.UninstallEvent, uninstallEvent);
        packageService = new AppPackageService(ipcService, zone);
    });

    afterEach(() => {
        ipcService.removeListenersFromAllChannels();
        packageService.ngOnDestroy();
    });

    it('all should send a request to ipc and get back items', (done) => {
        packageService.packagesChanged.subscribe((value: PluginPackageList) => {
            expect(value.packages.length).toEqual(packagesList.packages.length);
            done();
        });
        packageService.all();
    });

    it('get should throw error for not found', () => {
        expect(() => {
            packageService.get('not found');
        }).toThrowError();
    });

    it('get should throw even after all is called for not found', () => {
        packageService.all();
        expect(() => {
            packageService.get('not found');
        }).toThrowError();
    });

    it('install should set first\'s package install to true when getting package', (done) => {
        packageService.all();
        packageService.packagesChanged.subscribe((value: PluginPackageList) => {
            expect(value.packages[0].install).toBeTruthy();
            done();
        });
        packageService.install(packagesList.packages[0].name);
    });

    it('uninstall should set third\'s package install to false when getting packages', (done) => {
        packageService.all();
        packageService.packagesChanged.subscribe((value: PluginPackageList) => {
            expect(value.packages[2].install).toBeFalsy();
            done();
        });
        packageService.uninstall(packagesList.packages[2].name);
    });


});

