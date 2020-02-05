import { VisualizationSession } from '../../models';
import { Plugin, PluginPackage } from '../../../../shared/models';
import { PluginData } from 'data-science-lab-core';


export interface VisualizationAlgorithmSessionService {
    all(): VisualizationSession[];
    read(id: number): VisualizationSession;
    delete(id: number): void;
    create(id: number, pluginPackage: PluginPackage, plugin: Plugin,
           inputs: {[id: string]: PluginData}, 
           editing: number[]): Promise<VisualizationSession>;
}
