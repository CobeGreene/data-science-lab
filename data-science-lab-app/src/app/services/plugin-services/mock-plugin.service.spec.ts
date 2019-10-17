import { MockPluginService } from './mock-plugin.service';
import { Plugin } from '../../../../shared/models/plugin';

describe('Angular Mock Plugin Service Tests', () => {
    it('should create service with no plugins', () => {
        const service = new MockPluginService();
        expect(service.all().length).toBe(0);
    });

    it('init should create service with plugins', () => {
        const plugins = [
            new Plugin('name', 'owner', 'repo', false)
        ];
        const service = MockPluginService.init(plugins);
        expect(service.all().length).toBe(plugins.length);
    });

    it('install should set intall to true for plugin', (done) => {
        const plugins = [
            new Plugin('name', 'owner', 'repo', false)
        ];
        const service = MockPluginService.init(plugins);
        service.pluginsChanged.subscribe((value: Plugin[]) => {
            expect(value[0].install).toBeTruthy();
            done();
        });
        service.install(plugins[0].name);

    });

    it('install should throw for no plugins', () => {
        const service = new MockPluginService();
        expect(() => {
            service.install('name');
        }).toThrowError();
    });

    it('install should throw if plugin not found', () => {
        const plugins = [
            new Plugin('name1', 'owner1', 'repo1', false),
            new Plugin('name2', 'owner2', 'repo2', false)
        ];
        const service = MockPluginService.init(plugins);
        expect(() => {
            service.install('not found');
        }).toThrowError();
    });

    it('install should throw if already install', () => {
        const plugins = [
            new Plugin('name1', 'owner1', 'repo1', true)
        ];
        const service = MockPluginService.init(plugins);
        expect(() => {
            service.install(plugins[0].name);
        }).toThrowError();
    });

    it('uninstall should set uninstall to false for plugin', (done) => {
        const plugins = [
            new Plugin('name', 'owner', 'repo', true)
        ];
        const service = MockPluginService.init(plugins);
        service.pluginsChanged.subscribe((value: Plugin[]) => {
            expect(!value[0].install).toBeTruthy();
            done();
        });
        service.uninstall(plugins[0].name);
    });

    it('uninstall should throw for no plugins', () => {
        const service = new MockPluginService();
        expect(() => {
            service.uninstall('name');
        }).toThrowError();
    });

    it('uninstall should throw if plugin not found', () => {
        const plugins = [
            new Plugin('name1', 'owner1', 'repo1', false),
            new Plugin('name2', 'owner2', 'repo2', false)
        ];
        const service = MockPluginService.init(plugins);
        expect(() => {
            service.uninstall('not found');
        }).toThrowError();
    });

    it('uninstall should throw if not already install', () => {
        const plugins = [
            new Plugin('name1', 'owner1', 'repo1')
        ];
        const service = MockPluginService.init(plugins);
        expect(() => {
            service.uninstall(plugins[0].name);
        }).toThrowError();
    });

    it('get should retrieve plugin by name', () => {
        const plugins = [
            new Plugin('name1', 'owner1', 'repo1'),
            new Plugin('plugin', 'owner', 'repo'),
            new Plugin('name2', 'owner2', 'repo2'),
        ];
        const service = MockPluginService.init(plugins);
        const plugin = service.get('plugin');
        expect(plugin.owner).toEqual('owner');
    });

    it('get should throw error for no plugins', () => {
        const service = new MockPluginService();
        expect(() => {
            service.get('not found');
        }).toThrowError();
    });

    it('get should throw error even with plugins', () => {
        const plugins = [
            new Plugin('name1', 'owner1', 'repo1'),
            new Plugin('name2', 'owner2', 'repo2'),
            new Plugin('name3', 'owner3', 'repo3'),
        ];
        const service = MockPluginService.init(plugins);
        expect(() => {
            service.get('not found');
        }).toThrowError();
    });

});
