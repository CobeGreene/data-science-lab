import { Package, SessionPlugin } from '../../../../shared/models';

export interface SessionPluginDataService {
    all(): SessionPlugin[];
    install(pluginPackage: Package): Promise<void>;
    uninstall(pluginPackage: Package): Promise<void>;
}

