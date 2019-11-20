import { TransformSession } from '../../models';
import { Plugin, PluginPackage } from '../../../../shared/models';
import { PluginData } from 'data-science-lab-core';


export interface TransformSessionService {

    all(): TransformSession[];
    read(dataGroupId: number): TransformSession;
    delete(dataGroupId: number): void;
    create(dataGroupId: number, pluginPackage: PluginPackage,
           plugin: Plugin,
           inputs: {[id: string]: PluginData},
           featuresEditing: number[]): Promise<TransformSession>;


}


