import { PluginService } from './plugin.service';
import { Plugins, Plugin } from '../../../../shared/models';
import { serialize } from 'typescript-json-serializer';
import * as PluginsEvents from '../../../../shared/events/plugins-events';
import * as ErrorEvents from '../../../../shared/events/error-events';
import { IpService } from '../../../../shared/services/ip.service';
import { net } from 'electron';
import { PluginManager, IPluginInfo } from 'live-plugin-manager';

export class AppPluginService implements PluginService {

    private plugins: Plugins;
    private ipService: IpService;
    private fetch: boolean;
    private manager: PluginManager; 

    constructor(ipService: IpService, manager: PluginManager) {
        this.plugins = new Plugins();
        this.ipService = ipService;
        this.manager = manager;
        this.fetch = false;
    }

    inititalize(): void {
        this.registerGetAll();
        this.registerInstall();
    }

    destory(): void {
        this.unregisterGetAll();
        this.unregisterInstall();
        this.fetch = false;
        this.plugins.plugins = [];
    }

    private getPluginsFromServer(): void {
        const request = net.request({
            method: 'GET',
            protocol: 'https:',
            hostname: 'localhost',
            port: 44339,
            path: '/api/plugins'
        });
        request.on('response', (response) => {
            response.on('data', (chunk) => {
                if (response.statusCode === 200) {
                    const obj = JSON.parse(chunk.toString());
                    const temp = new Plugins();
                    obj.forEach(element => {
                        temp.plugins.push(new Plugin(element.name, element.owner, element.repositoryName));
                    });
                    this.plugins = temp;
                    const json = serialize(this.plugins);
                    this.ipService.send(PluginsEvents.GetAllListeners, json);
                }
                this.fetch = true;
            });
            response.on('error', () => {
                console.log(`Error: Couldn't load plugins from api`);
                this.ipService.send(ErrorEvents.ExceptionListeners, 'couldn\'t load plugins from api.');
            });
        });
        request.on('error', (error: Error) => {
            console.log(`Error: ${error.message} from api.`);
            this.ipService.send(ErrorEvents.ExceptionListeners, error.message);
        });
        request.end();
    }

    private registerGetAll(): void {
        this.ipService.on(PluginsEvents.GetAllEvent, this.getAllEvent);    
    } 
    
    private unregisterGetAll(): void {
        this.ipService.removeListener(PluginsEvents.GetAllEvent, this.getAllEvent);    
    }

    private getAllEvent = (_event, _arg): void => {
        if (!this.fetch) {
            this.getPluginsFromServer();
        }
        const json = serialize(this.plugins);
        this.ipService.send(PluginsEvents.GetAllListeners, json);
    }    

    private registerInstall(): void {
        this.ipService.on(PluginsEvents.InstallEvent, this.installEvent);
    }
    
    private unregisterInstall(): void {
        this.ipService.removeListener(PluginsEvents.InstallEvent, this.installEvent);
    }

    private installEvent = (_event, arg): void => {
        try {
            const name = arg[0];
            const find = this.plugins.plugins.findIndex((plugin: Plugin) => {
                return plugin.name.match(name) != null;
            });
            if (find >= 0) {
                const plugin = this.plugins.plugins[find];
                this.manager.installFromGithub(`${plugin.owner}/${plugin.repositoryName}`)
                    .then((value: IPluginInfo) => {
                        plugin.install = true;
                        const json = serialize(this.plugins);
                        this.ipService.send(PluginsEvents.GetAllListeners, json);
                    })
                    .catch((_reason: any) => {
                        this.ipService.send(ErrorEvents.ExceptionListeners, `Unable to install plugin: ${plugin.name}`);
                    });
            } else {
                throw new Error(`Couldn't find plugin with the name ${name}.`);
            }
        } catch (exception) {
            if (exception instanceof Error) {
                this.ipService.send(ErrorEvents.ExceptionListeners, exception.message);
            } else {
                this.ipService.send(ErrorEvents.ExceptionListeners, exception);
            }
        }
    }
    
}
