import { PluginManagerAdapter } from './plugin-manager.adapter';
import { Plugin, PluginPackage } from '../../../../shared/models';

export class MockPluginManagerAdapter implements PluginManagerAdapter {

    public install: (pluginPackage: PluginPackage) => Promise<void>;
    public uninstall: (pluginPackage: PluginPackage) => Promise<void>;
    public activate: <T>(pluginPackage: PluginPackage, plugin: Plugin) => Promise<T>;
    public deactivate: <T>(pluginPackage: PluginPackage) => Promise<T>;
    public deactivateAll: () => Promise<void>;

    constructor() {
        this.reset();
    }

    public reset() {
        this.install = (_) => new Promise<void>(() => { });
        this.uninstall = (_) => new Promise<void>(() => { });
        this.activate = <T>(_package, _plugin) => new Promise<T>((resolve, _) => { resolve(new Object() as T); });
        this.deactivate = <T>(_package) => new Promise<T>((resolve, _) => { resolve(new Object() as T); });
        this.deactivateAll = () => new Promise<void>(() => { });
    }

}

