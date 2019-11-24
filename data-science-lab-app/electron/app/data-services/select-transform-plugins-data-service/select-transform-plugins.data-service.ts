import { PluginPackage } from '../../../../shared/models';
import { TransformPluginViewModel  } from '../../../../shared/view-models';


export interface SelectTransformPluginsDataService {

    all(callback?: (plugins: TransformPluginViewModel[]) => void, error?: (reason: any) => void): TransformPluginViewModel[];
    
    install(pluginPackage: PluginPackage): Promise<TransformPluginViewModel[]>;
    uninstall(pluginPackage: PluginPackage): Promise<TransformPluginViewModel[]>;
}
