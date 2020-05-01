import { Package, Plugin } from '../../../../shared/models';
import { PluginContext } from './plugin.context';
import { PluginManager } from 'live-plugin-manager';
import { ServiceContainer, SERVICE_TYPES } from '../../service-container';
import { SettingsContext } from '../settings-context';
import { PackageError, ErrorTypes } from '../../../../shared/errors';

export class AppPluginContext implements PluginContext {
    private readonly key = 'plugin-package';
    private manager: PluginManager;

    get settings(): SettingsContext {
        return this.serviceContainer.resolve<SettingsContext>(SERVICE_TYPES.SettingsContext);
    }

    constructor(private serviceContainer: ServiceContainer) {

    }

    configure() {
        this.manager = new PluginManager({
            pluginsPath: this.settings.get<string>(this.key)
        });
    }

    install(pluginPackage: Package): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.manager.installFromGithub(`${pluginPackage.owner}/${pluginPackage.repositoryName}`).then((value) => {
                resolve();
            }).catch((value) => {
                reject(value);
            });
        });
    }

    uninstall(pluginPackage: Package): Promise<void> {
        return this.manager.uninstall(`${pluginPackage.owner}/${pluginPackage.repositoryName}`);
    }

    activate<T>(pluginPackage: Package, plugin: Plugin): Promise<T> {
        return new Promise<T>(async (resolve, reject) => {
            const find = this.manager.list().find(element => {
                return element.name === pluginPackage.repositoryName;
            });
            try {
                if (!find) {
                    await this.install(pluginPackage);
                    const main = this.manager.require(pluginPackage.repositoryName);
                    // tslint:disable-next-line: new-parens
                    resolve(new main[`${plugin.className}`] as T);
                } else {
                    const main = this.manager.require(pluginPackage.repositoryName);
                    // tslint:disable-next-line: new-parens
                    resolve(new main[`${plugin.className}`] as T);
                }
            } catch (reason) {
                reject(this.pluginError(pluginPackage, plugin));
            }
        });
    }

    deactivate(pluginPackage: Package, _plugin: Plugin): Promise<void> {
        // return this.uninstall(pluginPackage);
        return new Promise((resolve) => resolve());
    }
    deactivateAll(): Promise<void> {
        // return this.manager.uninstallAll();
        return new Promise((resolve) => resolve());
    }

    pluginError(pluginPackage: Package, plugin: Plugin): PackageError {
        return {
            header: 'Package Error',
            description: `Unable to activate the plugin ${plugin.name} for the package ${pluginPackage.name}`,
            type: ErrorTypes.Warning,
            issues: `https://www.github.com/${pluginPackage.owner}/${pluginPackage.repositoryName}/issues/new`
        };
    }
}


