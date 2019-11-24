import { SelectTransformPluginsDataService } from './select-transform-plugins.data-service';
import { PluginPackage, Plugin } from '../../../../shared/models';
import { TransformPluginViewModel } from '../../../../shared/view-models';
import { ServiceContainer, SERVICE_TYPES } from '../../services-container';
import { PackageDataService } from '../package-data-service';
import { PluginTypes, TransformPlugin } from 'data-science-lab-core';
import { PluginContext } from '../../contexts';

export class MockSelectTransformPluginsDataService implements SelectTransformPluginsDataService {
    all: (callback?: (plugins: TransformPluginViewModel[]) => void, error?: (reason: any) => void) => TransformPluginViewModel[];


    install: (pluginPackage: PluginPackage) => Promise<TransformPluginViewModel[]>;

    uninstall: (pluginPackage: PluginPackage) => Promise<TransformPluginViewModel[]>;

    constructor() {
        this.reset();
    }

    reset() {
        this.all = () => { throw new Error(`Not implemented.`); };
        this.install = () => { throw new Error(`Not implemented.`); };
        this.uninstall = () => { throw new Error(`Not implemented.`); };
    }

}

