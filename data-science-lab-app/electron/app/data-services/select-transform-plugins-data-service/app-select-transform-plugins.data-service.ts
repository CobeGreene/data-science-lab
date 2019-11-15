import { SelectTransformPluginsDataService } from './select-transform-plugins.data-service';
import { SelectTransformPlugin, PluginPackage } from '../../../../shared/models';
import { ServiceContainer } from '../../services-container';


export class AppSelectTransformPluginsDataService implements SelectTransformPluginsDataService {
    
    private plugins: SelectTransformPlugin[];
    private hasFetch: boolean;

    constructor(private serviceContainer: ServiceContainer) {
        
        this.hasFetch = false;
        this.plugins = [];
    }
    
    all(callback?: (plugins: SelectTransformPlugin[]) => void, error?: (reason: any) => void): SelectTransformPlugin[] {
        if (!this.hasFetch) {
            if (callback) {
                this.hasFetch = true;
                this.getAllTransformPlugins()
                    .then(callback)
                    .catch(error);
            }
        }
        return this.plugins;
    }    
    
    
    install(pluginPackage: PluginPackage, callback?: (plugins: SelectTransformPlugin[]) => void, error?: (reason: any) => void): void {
        throw new Error("Method not implemented.");
    }
    
    
    uninstall(pluginPackage: PluginPackage, callback?: (plugins: SelectTransformPlugin[]) => void, error?: (reason: any) => void): void {
        throw new Error("Method not implemented.");
    }

    private getAllTransformPlugins(): Promise<SelectTransformPlugin[]> {
        throw new Error("Method not implemented.")
    }
}

