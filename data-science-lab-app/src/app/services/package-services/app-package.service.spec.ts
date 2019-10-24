import { MockZone } from '../mock-zone';
import { AppPackageService } from './app-package.service';
import { PluginPackageList, PluginPackage } from '../../../../shared/models';
import { PackagesEvents } from '../../../../shared/events';
import { MockIpService } from '../../../../shared/services';
import { serialize } from 'typescript-json-serializer';

describe('Angular App Package Service Tests', () => {
    let packageService: AppPackageService;
    let ipService: MockIpService;
    let packagesList: PluginPackageList;
    let zone: MockZone;

    const getAllEvent = (event, arg): void => {
        const json = serialize(packagesList);
        ipService.send(PackagesEvents.GetAllListeners, json);
    };

    const installEvent = (event, arg): void => {
        const name = arg[0];
        const find = packagesList.packages.findIndex((value: PluginPackage) => {
            return value.name === name;
        });
        if (find >= 0) {
            packagesList.packages[find].install = true;
            const json = serialize(packagesList);
            ipService.send(PackagesEvents.GetAllListeners, json);
        }
    };

    const uninstallEvent = (event, arg): void => {
        const name = arg[0];
        const find = packagesList.packages.findIndex((value: PluginPackage) => {
            return value.name === name;
        });
        if (find >= 0) {
            packagesList.packages[find].install = false;
            const json = serialize(packagesList);
            ipService.send(PackagesEvents.GetAllListeners, json);
        }
    };

    beforeAll(() => {
        packagesList = new PluginPackageList([
            new PluginPackage({ name: 'first', owner: 'owner1', repositoryName: 'reop1', username: 'user1' }),
            new PluginPackage({ name: 'second', owner: 'owner2', repositoryName: 'reop2', username: 'user2' }),
            new PluginPackage({ name: 'third', owner: 'owner3', repositoryName: 'reop3', username: 'user3', plugins: [], install: false })
        ]);
        zone = new MockZone({});
        ipService = new MockIpService();
    });

    beforeEach(() => {
        ipService.on(PackagesEvents.GetAllEvent, getAllEvent);
        ipService.on(PackagesEvents.InstallEvent, installEvent);
        ipService.on(PackagesEvents.UninstallEvent, uninstallEvent);
        packageService = new AppPackageService(ipService, zone);
    });

    afterEach(() => {
        ipService.removeListenersFromAllChannels();
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

