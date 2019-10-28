import { PluginManagerAdapter } from './plugin-manager.adapter';
import { PluginPackage, Plugin } from '../../../../shared/models';
import { PluginManager } from 'live-plugin-manager';

export class AppPluginManagerAdapter implements PluginManagerAdapter {

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
    get<T>(pluginPackage: PluginPackage, plugin: Plugin): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            const find = this.manager.list().forEach(element => {
                return element.name === pluginPackage.repositoryName;
            });
            if (find == null) {
                this.install(pluginPackage).then(() => {
                    const main = this.manager.require(pluginPackage.repositoryName);
                    // tslint:disable-next-line: new-parens
                    resolve(new main[`${plugin.className}`] as T);
                }).catch(reject);
            } else {
                const main = this.manager.require(pluginPackage.repositoryName);
                // tslint:disable-next-line: new-parens
                resolve(new main[`${plugin.className}`] as T);
            }
        });
    }


}
