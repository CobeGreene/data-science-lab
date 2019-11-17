import { SelectTransformPluginsDataService } from './select-transform-plugins.data-service';
import { SelectTransformPlugin, PluginPackage, Plugin, SelectTransformPluginInput } from '../../../../shared/models';
import { ServiceContainer, SERVICE_TYPES } from '../../services-container';
import { PackageDataService } from '../package-data-service';
import { PluginTypes, TransformPlugin } from 'data-science-lab-core';
import { PluginContext } from '../../contexts';

export class MockSelectTransformPluginsDataService implements SelectTransformPluginsDataService {
    all: (callback?: (plugins: SelectTransformPlugin[]) => void, error?: (reason: any) => void) => SelectTransformPlugin[];


    install: (pluginPackage: PluginPackage) => Promise<SelectTransformPlugin[]>;

    uninstall: (pluginPackage: PluginPackage) => Promise<SelectTransformPlugin[]>;

    constructor() {
        this.reset();
    }

    reset() {
        this.all = () => { throw new Error(`Not implemented.`); };
        this.install = () => { throw new Error(`Not implemented.`); };
        this.uninstall = () => { throw new Error(`Not implemented.`); };
    }

}

