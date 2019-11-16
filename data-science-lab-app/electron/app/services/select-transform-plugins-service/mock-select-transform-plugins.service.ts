import { PluginPackage } from '../../../../shared/models';
import { SelectTransformPluginsService } from './select-transform-plugins.service';

export class MockSelectTransformPluginsService implements SelectTransformPluginsService {
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

