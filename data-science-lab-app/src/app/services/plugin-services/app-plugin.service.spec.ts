import { AppPluginService } from './app-plugin.service';
import { Plugin, Plugins } from '../../../../shared/models';
import * as PluginsEvents from '../../../../shared/events/plugins-events';
import * as ErrorEvents from '../../../../shared/events/error-events';
import { MockIpService } from '../../../../shared/services/mock-ip.service';
import { serialize } from 'typescript-json-serializer';

describe('Angular App Plugin Service Tests', () => {
    let pluginService: AppPluginService;
    let ipService: MockIpService;
    let plugins: Plugins;

    const getAllEvent = (event, arg): void => {
        const json = serialize(plugins);
        ipService.send(PluginsEvents.GetAllListeners, json);
    };

    const installEvent = (event, arg): void => {
        try {
            const name = arg[0];
            const find = plugins.plugins.findIndex((plugin: Plugin) => {
                return plugin.name === name;
            });
            if (find >= 0) {
                plugins.plugins[find].install = true;
                const json = serialize(plugins);
                ipService.send(PluginsEvents.GetAllListeners, json);
            } else {
                throw new Error(`Couldn't find plugin with the name ${name}.`);
            }
        } catch (exception) {
            if (exception instanceof Error) {
                ipService.send(ErrorEvents.ExceptionListeners, exception.message);
            } else {
                ipService.send(ErrorEvents.ExceptionListeners, exception);
            }
        }
    };

    const uninstallEvent = (event, arg): void => {
        try {
            const name = arg[0];
            const find = plugins.plugins.findIndex((plugin: Plugin) => {
                return plugin.name === name;
            });
            if (find >= 0) {
                plugins.plugins[find].install = false;
                const json = serialize(plugins);
                ipService.send(PluginsEvents.GetAllListeners, json);
            } else {
                throw new Error(`Couldn't find plugin with the name ${name}.`);
            }
        } catch (exception) {
            if (exception instanceof Error) {
                ipService.send(ErrorEvents.ExceptionListeners, exception.message);
            } else {
                ipService.send(ErrorEvents.ExceptionListeners, exception);
            }
        }
    };

    beforeAll(() => {
        plugins = new Plugins([
            new Plugin('first', 'owner1', 'repo1'),
            new Plugin('second', 'owner2', 'repo2'),
            new Plugin('third', 'owner3', 'repo3'),
        ]);
        ipService = new MockIpService();
    });
    
    beforeEach(() => {
        ipService.on(PluginsEvents.GetAllEvent, getAllEvent);
        ipService.on(PluginsEvents.InstallEvent, installEvent);
        ipService.on(PluginsEvents.UninstallEvent, uninstallEvent);
        pluginService = new AppPluginService(ipService);
    });
    
    afterEach(() => {
        ipService.removeListenersFromAllChannels();
        pluginService.ngOnDestroy();
    });

    it('all should send a request to ipc and get back items', (done) => {
        pluginService.pluginsChanged.subscribe((value: Plugin[]) => {
            expect(value.length).toEqual(plugins.plugins.length);
            done();
        });
        pluginService.all();
    });      

    it('get should throw error for not found', () => {
        expect(() => {
            pluginService.get('not found');
        }).toThrowError();
    });

    it('get should throw even after all is called for not found', () => {
        pluginService.all();
        expect(() => {
            pluginService.get('not found');
        }).toThrowError();
    });

    it('install should set first\'s plugin install to true when getting plugins', (done) => {
        pluginService.all();
        pluginService.pluginsChanged.subscribe((value: Plugin[]) => {
            expect(value[0].install).toBeTruthy();
            done();
        });
        pluginService.install(plugins.plugins[0].name);
    });

    it('uninstall should set third\'s plugin install to false when getting plugins', (done) => {
        pluginService.all();
        pluginService.pluginsChanged.subscribe((value: Plugin[]) => {
            expect(value[2].install).toBeFalsy();
            done();
        });
        pluginService.uninstall(plugins.plugins[2].name);
    });
     

});

