import { PluginManagerAdapter } from './plugin-manager.adapter';
import { Plugin, PluginPackage } from '../../../../shared/models';

export class MockPluginManagerAdapter implements PluginManagerAdapter {

    public install: (pluginPackage: PluginPackage) => Promise<void>;
    public uninstall: (pluginPackage: PluginPackage) => Promise<void>;
    public get: <T>(pluginPackage: PluginPackage, plugin: Plugin) => Promise<T>;

    constructor() {
        this.install = (_) => new Promise<void>(() => { });
        this.uninstall = (_) => new Promise<void>(() => { });
        this.get = <T>(_package, _plugin) => new Promise<T>((resolve, _) => { resolve(new Object() as T); });
    }

}

