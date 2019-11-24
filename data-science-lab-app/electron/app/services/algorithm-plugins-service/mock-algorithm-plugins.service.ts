import { PluginPackage } from '../../../../shared/models';
import { AlgorithmPluginsService } from './algorithm-plugins.service';

export class MockAlgorithmPluginsService implements AlgorithmPluginsService {
    all: () => void;
    
    install: (pluginPackage: PluginPackage) => void;
    
    uninstall: (pluginPackage: PluginPackage) => void;

    constructor() {
        this.reset();
    }

    reset() {
        this.all = () => {};
        this.install = (_) => {};
        this.uninstall = (_) => {};
    }


}

