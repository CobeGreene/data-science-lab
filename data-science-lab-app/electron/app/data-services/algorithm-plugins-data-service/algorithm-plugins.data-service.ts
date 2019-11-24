import { PluginPackage } from '../../../../shared/models';
import { AlgorithmPluginViewModel } from '../../../../shared/view-models';


export interface AlgorithmPluginsDataService {

    all(callback?: (plugins: AlgorithmPluginViewModel[]) => void, error?: (reason: any) => void): AlgorithmPluginViewModel[];
    
    install(pluginPackage: PluginPackage): Promise<AlgorithmPluginViewModel[]>;
    uninstall(pluginPackage: PluginPackage): Promise<AlgorithmPluginViewModel[]>;
}
