import { SelectVisualizationPluginsDataService } from './select-visualization-plugins.data-service';
import { PluginPackage, Plugin } from '../../../../shared/models';
import { VisualizationPluginViewModel, PluginInputViewModel  } from '../../../../shared/view-models';
import { ServiceContainer, SERVICE_TYPES } from '../../services-container';
import { PackageDataService } from '../package-data-service';
import { PluginTypes, VisualizationPlugin } from 'data-science-lab-core';
import { PluginContext } from '../../contexts';

export class AppSelectVisualizationPluginsDataService implements SelectVisualizationPluginsDataService {
    private plugins: VisualizationPluginViewModel[];
    private hasFetch: boolean;

    constructor(private serviceContainer: ServiceContainer) {
        this.hasFetch = false;
        this.plugins = [];
    }

    all(callback?: (plugins: VisualizationPluginViewModel[]) => void, error?: (reason: any) => void): VisualizationPluginViewModel[] {
        console.log('getting vis plugins');
        if (!this.hasFetch) {
            if (callback) {
                this.hasFetch = true;
                this.getAllVisualizationPlugins(error)
                    .then(callback)
                    .catch(error);
            }
        }
        return this.plugins;
    }

    private getAllVisualizationPlugins(error?: (reason: any) => void): Promise<VisualizationPluginViewModel[]> {
        return new Promise(async (resolve, reject) => {
            const dataService = this.serviceContainer.resolve<PackageDataService>(SERVICE_TYPES.PackageDataService);
            const pluginContext = this.serviceContainer.resolve<PluginContext>(SERVICE_TYPES.PluginContext);

            const installPackages = dataService.all().packages.filter((value) => {
                return value.install;
            });

            const visualizationPlugins: VisualizationPluginViewModel[] = [];
            for (const pluginPackage of installPackages) {
                try {
                    for (const plugin of pluginPackage.plugins.filter((value) => {
                        return value.type === PluginTypes.Visualization;
                    })) {
                        plugin.packageName = pluginPackage.name;
                        const visualPlugin = await pluginContext.activate<VisualizationPlugin>(pluginPackage, plugin);
                        const inputs = visualPlugin.getInputs().inputs();
                        const selectVisualPlugin = new VisualizationPluginViewModel({
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
                        visualizationPlugins.push(selectVisualPlugin);
                    }
                } catch (reason) {
                    if (error) {
                        error(reason);
                    }
                }
            }

            this.plugins = visualizationPlugins;
            resolve(this.plugins);
        });
    }

    install(pluginPackage: PluginPackage): Promise<VisualizationPluginViewModel[]> {
        return new Promise<VisualizationPluginViewModel[]>(async (resolve, reject) => {
            if (!this.hasFetch) {
                this.hasFetch = true;
                await this.getAllVisualizationPlugins();
            }   

            if (this.plugins.find((value) => {
                return value.plugin.packageName === pluginPackage.name;
            })) {
                resolve(this.plugins);
            }
            const pluginContext = this.serviceContainer.resolve<PluginContext>(SERVICE_TYPES.PluginContext);
            try {
                for (const plugin of pluginPackage.plugins.filter((value) => {
                    return value.type === PluginTypes.Visualization;
                })) {

                    plugin.packageName = pluginPackage.name;
                    const visualizationPlugin = await pluginContext.activate<VisualizationPlugin>(pluginPackage, plugin);

                    const inputs = visualizationPlugin.getInputs().inputs();
                    const selectVisualizationPlugin = new VisualizationPluginViewModel({
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
                    this.plugins.push(selectVisualizationPlugin);
                }
            } catch (reason) {
                reject(reason);
            }
            resolve(this.plugins);
        });
    }

    uninstall(pluginPackage: PluginPackage): Promise<VisualizationPluginViewModel[]> {
        return new Promise<VisualizationPluginViewModel[]>(async (resolve, reject) => {
            if (!this.hasFetch) {
                this.hasFetch = true;
                await this.getAllVisualizationPlugins();
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
