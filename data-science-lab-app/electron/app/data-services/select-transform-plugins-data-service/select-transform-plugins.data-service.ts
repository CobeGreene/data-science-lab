import { SelectTransformPlugin, PluginPackage } from '../../../../shared/models';


export interface SelectTransformPluginsDataService {

    all(callback?: (plugins: SelectTransformPlugin[]) => void, error?: (reason: any) => void): SelectTransformPlugin[];
    install(pluginPackage: PluginPackage,
            callback?: (plugins: SelectTransformPlugin[]) => void,
            error?: (reason: any) => void): void;
    uninstall(pluginPackage: PluginPackage,
              callback?: (plugins: SelectTransformPlugin[]) => void,
              error?: (reason: any) => void): void;
}
