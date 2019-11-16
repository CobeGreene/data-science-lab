import { SelectTransformPlugin, PluginPackage } from '../../../../shared/models';


export interface SelectTransformPluginsDataService {

    all(callback?: (plugins: SelectTransformPlugin[]) => void, error?: (reason: any) => void): SelectTransformPlugin[];
    
    install(pluginPackage: PluginPackage): Promise<SelectTransformPlugin[]>;
    uninstall(pluginPackage: PluginPackage): Promise<SelectTransformPlugin[]>;
}
