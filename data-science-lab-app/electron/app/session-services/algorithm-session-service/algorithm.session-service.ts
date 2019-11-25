import { AlgorithmSession } from '../../models';
import { Plugin, PluginPackage } from '../../../../shared/models';
import { PluginData } from 'data-science-lab-core';

export interface AlgorithmSessionService {
    all(): AlgorithmSession[];
    read(dataGroupId: number): AlgorithmSession;
    delete(dataGroupId: number): void;
    create(dataGroupId: number, pluginPackage: PluginPackage,
           plugin: Plugin,
           inputs: {[id: string]: PluginData},
           features: { [id: string]: { label: string, type: string}[] }
           ): Promise<AlgorithmSession>;

    removeFromService(dataGroupId: number): void;
}
