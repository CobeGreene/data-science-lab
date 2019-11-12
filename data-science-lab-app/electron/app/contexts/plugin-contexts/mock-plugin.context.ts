import { PluginPackage, Plugin } from '../../../../shared/models';
import { PluginContext } from './plugin.context';

export class MockPluginContext implements PluginContext {
    public install: (pluginPackage: PluginPackage) => Promise<void>;
    public uninstall: (pluginPackage: PluginPackage) => Promise<void>;
    public activate: <T>(pluginPackage: PluginPackage, plugin: Plugin) => Promise<T>;
    public deactivate: (pluginPackage: PluginPackage, plugin: Plugin) => Promise<void>;
    public deactivateAll: () => Promise<void>;

    constructor() {
        this.reset();
    }

    public reset() {
        this.install = (_) => new Promise<void>((resolve) => { resolve(); });
        this.uninstall = (_) => new Promise<void>((resolve) => { resolve(); });
        this.activate = <T>(_package, _plugin) => new Promise<T>((resolve, _) => { resolve(new Object() as T); });
        this.deactivate = (_package, _plugin) => new Promise<void>((resolve, _) => { resolve(); });
        this.deactivateAll = () => new Promise<void>((resolve) => { resolve(); });
    }
}
