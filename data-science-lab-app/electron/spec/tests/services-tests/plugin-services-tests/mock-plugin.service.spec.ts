import { MockPluginService } from '../../../../app/services/plugin-services/mock-plugin.service';
import { Plugin, Plugins } from '../../../../../shared/models';
import { deserialize } from 'typescript-json-serializer';
import * as PluginsEvents from '../../../../../shared/events/plugins-events';
import * as ErrorEvents from '../../../../../shared/events/error-events';
import { MockIpService } from '../../../../../shared/services/mock-ip.service';

describe('Electron Mock Plugin Service Tests', () => {
    let pluginService: MockPluginService; 
    let ipService: MockIpService;
    let plugins: Plugins;

    beforeAll(() => {
        plugins = new Plugins([
            new Plugin('first', 'owner1', 'repo1'),
            new Plugin('second', 'owner2', 'repo2'),
            new Plugin('third', 'owner3', 'repo3', true),
        ]);
        ipService = new MockIpService();
    });

    beforeEach(() => {
        const temp = new Plugins(plugins.plugins.slice());
        pluginService = MockPluginService.init(temp, ipService);
        pluginService.inititalize();
    });

    afterEach(() => {
        pluginService.destory();
        ipService.removeListenersFromAllChannels();
    });

    it('get all should retrieve arguments', (done) => {
        ipService.on(PluginsEvents.GetAllListeners, (_event, arg) => {
            expect(arg).toBeDefined();
            done();
        });
        ipService.send(PluginsEvents.GetAllEvent);
    });

    it('get all should retrieve plugins in json', (done) => {
        ipService.on(PluginsEvents.GetAllListeners, (_event, arg) => {
            const json = arg[0];
            const values = deserialize<Plugins>(json, Plugins);
            expect(values).toBeDefined();
            done();
        });
        ipService.send(PluginsEvents.GetAllEvent);
    });

    it('get all should retrieve plugins of length plugins', (done) => {
        ipService.on(PluginsEvents.GetAllListeners, (_event, arg) => {
            const json = arg[0];
            const values = deserialize<Plugins>(json, Plugins);
            expect(values.plugins.length).toBe(plugins.plugins.length);
            done();
        });
        ipService.send(PluginsEvents.GetAllEvent);
    });

    it('install should return plugins with first install', (done) => {
        ipService.on(PluginsEvents.GetAllListeners, (_event, arg) => {
            const values = deserialize<Plugins>(arg[0], Plugins);
            expect(values.plugins[0].install).toBeTruthy();
            done();
        });
        ipService.send(PluginsEvents.InstallEvent, plugins.plugins[0].name);
    });

    it('install should retrieve error when can\'t find install', (done) => {
        ipService.on(ErrorEvents.ExceptionListeners, (_event, arg) => {
            const value = arg[0];
            expect(value).toBeDefined();
            done();
        });
        ipService.send(PluginsEvents.InstallEvent, 'not found');
    });

    it('install shold retrieve error when no arguments passed', (done) => {
        ipService.on(ErrorEvents.ExceptionListeners, (_event, arg) => {
            const value = arg[0];
            expect(value).toBeDefined();
            done();
        });
        ipService.send(PluginsEvents.InstallEvent);
    });

    it('uninstall should return plugins when third uninstall', (done) => {
        ipService.on(PluginsEvents.GetAllListeners, (_event, arg) => {
            const values = deserialize<Plugins>(arg[0], Plugins);
            expect(values.plugins[2].install).toBeFalsy();
            done();
        });
        ipService.send(PluginsEvents.UninstallEvent, plugins.plugins[2].name);
    });

    it('uninstall should retrieve error when can\'t find name', (done) => {
        ipService.on(ErrorEvents.ExceptionListeners, (_event, arg) => {
            const value = arg[0];
            expect(value).toBeDefined();
            done();
        });
        ipService.send(PluginsEvents.UninstallEvent, 'not found');
    });

    it('uninstall shold retrieve error when no arguments passed', (done) => {
        ipService.on(ErrorEvents.ExceptionListeners, (_event, arg) => {
            const value = arg[0];
            expect(value).toBeDefined();
            done();
        });
        ipService.send(PluginsEvents.UninstallEvent);
    });
    
});
