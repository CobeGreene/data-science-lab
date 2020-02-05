import { PluginData } from 'data-science-lab-core';
import { ExperimentDataGroup } from '../../models';

export interface PluginDataConverter {

    toDataGroups(data: PluginData): ExperimentDataGroup[];

    
}
