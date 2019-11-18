import { TransformSession } from '../../models';
import { Plugin, PluginPackage } from '../../../../shared/models';
import { PluginData } from 'data-science-lab-core';
import { TransformSessionService } from './transform.session-service';


export class MockTransformSessionService implements TransformSessionService {
    all: () => TransformSession[];

    read: (dataGroupId: number) => TransformSession;

    delete: (dataGroupId: number) => void;

    create: (dataGroupId: number, pluginPackage: PluginPackage,
             plugin: Plugin,
             inputs: { [id: string]: PluginData; }) => Promise<TransformSession>;


    constructor() {
        this.reset();
    }

    reset() {
        this.all = () => [];
        this.read = () => { throw new Error(`Not implemented`); };
        this.delete = () => { };
        this.create = () => { throw new Error('Not implemented'); };
    }

}


