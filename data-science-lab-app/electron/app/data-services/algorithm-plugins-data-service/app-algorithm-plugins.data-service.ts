import { AlgorithmPluginsDataService } from './algorithm-plugins.data-service';
import { PluginPackage, Plugin } from '../../../../shared/models';
import { AlgorithmPluginViewModel, PluginInputViewModel  } from '../../../../shared/view-models';
import { ServiceContainer, SERVICE_TYPES } from '../../services-container';
import { PackageDataService } from '../package-data-service';
import { PluginTypes, AlgorithmPlugin } from 'data-science-lab-core';
import { PluginContext } from '../../contexts';


export class AppAlgorithmPluginsDataService implements AlgorithmPluginsDataService {

    private plugins: AlgorithmPluginViewModel[];
    private hasFetch: boolean;

    constructor(private serviceContainer: ServiceContainer) {

        this.hasFetch = false;
        this.plugins = [];
    }

    all(callback?: (plugins: AlgorithmPluginViewModel[]) => void, error?: (reason: any) => void): AlgorithmPluginViewModel[] {
        if (!this.hasFetch) {
            if (callback) {
                this.hasFetch = true;
                this.getAllAlgorithmPlugins(error)
                    .then(callback)
                    .catch(error);
            }
        }
        return this.plugins;
    }

    private getAllAlgorithmPlugins(error?: (reason: any) => void): Promise<AlgorithmPluginViewModel[]> {
        return new Promise(async (resolve, reject) => {
            const dataService = this.serviceContainer.resolve<PackageDataService>(SERVICE_TYPES.PackageDataService);
            const pluginContext = this.serviceContainer.resolve<PluginContext>(SERVICE_TYPES.PluginContext);

            const installPackages = dataService.all().packages.filter((value) => {
                return value.install;
            });

            const algorithmPlugins: AlgorithmPluginViewModel[] = [];
            for (const pluginPackage of installPackages) {
                try {
                    for (const plugin of pluginPackage.plugins.filter((value) => {
                        return value.type === PluginTypes.Algorithm;
                    })) {
                        plugin.packageName = pluginPackage.name;
                        const transformPlugin = await pluginContext.activate<AlgorithmPlugin>(pluginPackage, plugin);
                        const inputs = transformPlugin.getInputs().inputs();
                        const selectTransformPlugin = new AlgorithmPluginViewModel({
                            plugin,
                            inputs: inputs.map((input) => {
                                return new PluginInputViewModel({
                                    id: input.id,
                                    label: input.label,
                                    type: input.type,
                                    min: input.min,
                                    max: input.max
                                });
                            })
                        });
                        
                        await pluginContext.deactivate(pluginPackage, plugin);
                        algorithmPlugins.push(selectTransformPlugin);
                    }
                } catch (reason) {
                    if (error) {
                        error(reason);
                    }
                }
            }

            this.plugins = algorithmPlugins;
            resolve(this.plugins);
        });
    }

    install(pluginPackage: PluginPackage): Promise<AlgorithmPluginViewModel[]> {
        return new Promise<AlgorithmPluginViewModel[]>(async (resolve, reject) => {
            if (!this.hasFetch) {
                this.hasFetch = true;
                await this.getAllAlgorithmPlugins();
            }   

            if (this.plugins.find((value) => {
                return value.plugin.packageName === pluginPackage.name;
            })) {
                resolve(this.plugins);
            }
            const pluginContext = this.serviceContainer.resolve<PluginContext>(SERVICE_TYPES.PluginContext);
            try {
                for (const plugin of pluginPackage.plugins.filter((value) => {
                    return value.type === PluginTypes.Algorithm;
                })) {

                    plugin.packageName = pluginPackage.name;
                    const algorithmPlugin = await pluginContext.activate<AlgorithmPlugin>(pluginPackage, plugin);

                    const inputs = algorithmPlugin.getInputs().inputs();
                    const selectTransformPlugin = new AlgorithmPluginViewModel({
                        plugin,
                        inputs: inputs.map((input) => {
                            return new PluginInputViewModel({
                                id: input.id,
                                label: input.label,
                                type: input.type,
                                min: input.min,
                                max: input.max
                            });
                        })
                    });
                    await pluginContext.deactivate(pluginPackage, plugin);
                    this.plugins.push(selectTransformPlugin);
                }
            } catch (reason) {
                reject(reason);
            }
            resolve(this.plugins);
        });
    }

    uninstall(pluginPackage: PluginPackage): Promise<AlgorithmPluginViewModel[]> {
        return new Promise<AlgorithmPluginViewModel[]>(async (resolve, reject) => {
            if (!this.hasFetch) {
                this.hasFetch = true;
                await this.getAllAlgorithmPlugins();
            }
            const pluginContext = this.serviceContainer.resolve<PluginContext>(SERVICE_TYPES.PluginContext);

            const plugins: Plugin[] = [];

            this.plugins = this.plugins.filter((value) => {
                if (value.plugin.packageName === pluginPackage.name) {
                    plugins.push(value.plugin);
                    return true;
                }
                return false;
            });

            for (const plugin of plugins) {
                await pluginContext.deactivate(pluginPackage, plugin);
            }

            resolve(this.plugins);
        });
    }
}

