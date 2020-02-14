import { PluginPackage, Plugin } from '../../../../shared/models';
import { PluginContext } from './plugin.context';
import { PluginManager } from 'live-plugin-manager';

export class AppPluginContext implements PluginContext {
    private manager: PluginManager;

    constructor(pluginPath?: string) {
        this.manager = new PluginManager({
            pluginsPath: pluginPath
        });
    }

    install(pluginPackage: PluginPackage): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.manager.installFromGithub(`${pluginPackage.owner}/${pluginPackage.repositoryName}`).then((_) => {
                resolve();
            }).catch((value) => {
                reject(value);
            });
        });
    }

    uninstall(pluginPackage: PluginPackage): Promise<void> {
        return this.manager.uninstall(`${pluginPackage.owner}/${pluginPackage.repositoryName}`);
    }

    activate<T>(pluginPackage: PluginPackage, plugin: Plugin): Promise<T> {
        return new Promise<T>(async (resolve, reject) => {
            const find = this.manager.list().forEach(element => {
                return element.name === pluginPackage.repositoryName;
            });
            if (find == null) {
                try {
                    await this.install(pluginPackage);
                    const main = this.manager.require(pluginPackage.repositoryName);
                    // tslint:disable-next-line: new-parens
                    resolve(new main[`${plugin.className}`] as T);
                } catch (reason) {
                    reject(reason);
                }
            } else {
                const main = this.manager.require(pluginPackage.repositoryName);
                // tslint:disable-next-line: new-parens
                resolve(new main[`${plugin.className}`] as T);
            }
        });
    }

    
    deactivate(pluginPackage: PluginPackage, _plugin: Plugin): Promise<void> {
        // return this.uninstall(pluginPackage);
        return new Promise((resolve) => resolve());
    }
    deactivateAll(): Promise<void> {
        // return this.manager.uninstallAll();
        return new Promise((resolve) => resolve());
    }
}

