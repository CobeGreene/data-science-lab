import { AlgorithmPluginsDataService } from './algorithm-plugins.data-service';
import { PluginPackage } from '../../../../shared/models';
import { AlgorithmPluginViewModel } from '../../../../shared/view-models';

export class MockAlgorithmPluginsDataService implements AlgorithmPluginsDataService {
    all: (callback?: (plugins: AlgorithmPluginViewModel[]) => void, error?: (reason: any) => void) => AlgorithmPluginViewModel[];


    install: (pluginPackage: PluginPackage) => Promise<AlgorithmPluginViewModel[]>;

    uninstall: (pluginPackage: PluginPackage) => Promise<AlgorithmPluginViewModel[]>;

    constructor() {
        this.reset();
    }

    reset() {
        this.all = () => { throw new Error(`Not implemented.`); };
        this.install = () => { throw new Error(`Not implemented.`); };
        this.uninstall = () => { throw new Error(`Not implemented.`); };
    }

}

