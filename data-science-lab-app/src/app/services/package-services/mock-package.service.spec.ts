import { MockPackageService } from './mock-package.service';
import { PluginPackageList, PluginPackage } from '../../../../shared/models';

describe('Angular Mock Package Service Tests', () => {
    it('should create service with no packages', () => {
        const service = new MockPackageService();
        expect(service.all().packages.length).toBe(0);
    });

    it('init should create service with packages', () => {
        const packagesList = new PluginPackageList(
            [
                new PluginPackage('name', 'owner', 'repo', 'username')
            ]
        );
        const service = MockPackageService.init(packagesList);
        expect(service.all().packages.length)
            .toBe(packagesList.packages.length);
    });

    it('install should set intall to true for package', (done) => {
        const packagesList = new PluginPackageList(
            [
                new PluginPackage('name', 'owner', 'repo', 'username')
            ]
        );
        const service = MockPackageService.init(packagesList);
        service.packagesChanged.subscribe((value: PluginPackageList) => {
            expect(value.packages[0].install).toBeTruthy();
            done();
        });
        service.install(packagesList.packages[0].name);

    });

    it('install should throw for no packages', () => {
        const service = new MockPackageService();
        expect(() => {
            service.install('name');
        }).toThrowError();
    });

    it('install should throw if package not found', () => {
        const packagesList = new PluginPackageList(
            [
                new PluginPackage('name1', 'owner1', 'repo1', 'username1'),
                new PluginPackage('name2', 'owner2', 'repo2', 'username2')
            ]
        );
        const service = MockPackageService.init(packagesList);
        expect(() => {
            service.install('not found');
        }).toThrowError();
    });

    it('install should throw if already install', () => {
        const packagesList = new PluginPackageList(
            [
                new PluginPackage('name', 'owner', 'repo', 'username', [], true)
            ]
        );
        const service = MockPackageService.init(packagesList);
        expect(() => {
            service.install(packagesList.packages[0].name);
        }).toThrowError();
    });

    it('uninstall should set uninstall to false for package', (done) => {
        const packagesList = new PluginPackageList(
            [
                new PluginPackage('name', 'owner', 'repo', 'username', [], true)
            ]
        );
        const service = MockPackageService.init(packagesList);
        service.packagesChanged.subscribe((value: PluginPackageList) => {
            expect(!value.packages[0].install).toBeTruthy();
            done();
        });
        service.uninstall(packagesList.packages[0].name);
    });

    it('uninstall should throw for no packages', () => {
        const service = new MockPackageService();
        expect(() => {
            service.uninstall('name');
        }).toThrowError();
    });

    it('uninstall should throw if packages not found', () => {
        const packagesList = new PluginPackageList(
            [
                new PluginPackage('name1', 'owner1', 'repo1', 'username1'),
                new PluginPackage('name2', 'owner2', 'repo2', 'username2')
            ]
        );
        const service = MockPackageService.init(packagesList);
        expect(() => {
            service.uninstall('not found');
        }).toThrowError();
    });

    it('uninstall should throw if not already install', () => {
        const packagesList = new PluginPackageList(
            [
                new PluginPackage('name', 'owner', 'repo', 'username')
            ]
        );
        const service = MockPackageService.init(packagesList);
        expect(() => {
            service.uninstall(packagesList.packages[0].name);
        }).toThrowError();
    });

    it('get should retrieve package by name', () => {
        const packagesList = new PluginPackageList(
            [
                new PluginPackage('name1', 'owner1', 'repo1', 'username1'),
                new PluginPackage('plugin', 'owner', 'repo', 'username'),
                new PluginPackage('name2', 'owner2', 'repo2', 'username2'),
            ]
        );
        const service = MockPackageService.init(packagesList);
        const pluginPackage = service.get('plugin');
        expect(pluginPackage.owner).toEqual('owner');
    });

    it('get should throw error for no packages', () => {
        const service = new MockPackageService();
        expect(() => {
            service.get('not found');
        }).toThrowError();
    });

    it('get should throw error even with packages', () => {
        const packagesList = new PluginPackageList(
            [
                new PluginPackage('name1', 'owner1', 'repo1', 'username1'),
                new PluginPackage('plugin', 'owner', 'repo', 'username'),
                new PluginPackage('name2', 'owner2', 'repo2', 'username2'),
            ]
        );
        const service = MockPackageService.init(packagesList);
        expect(() => {
            service.get('not found');
        }).toThrowError();
    });

});
