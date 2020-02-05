import { PluginPackage } from '../../../../shared/models';
import { VisualizationPluginViewModel } from '../../../../shared/view-models';


export interface SelectVisualizationPluginsDataService {

    all(callback?: (plugins: VisualizationPluginViewModel[]) => void,
        error?: (reason: any) => void): VisualizationPluginViewModel[];

    install(pluginPackage: PluginPackage): Promise<VisualizationPluginViewModel[]>;    
    uninstall(pluginPackage: PluginPackage): Promise<VisualizationPluginViewModel[]>;    

}
