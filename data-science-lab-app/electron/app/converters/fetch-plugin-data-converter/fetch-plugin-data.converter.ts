import { FetchPluginData } from 'data-science-lab-core';
import { ExperimentDataGroup } from '../../models';

export interface FetchPluginDataConverter {

    toDataGroups(data: FetchPluginData): ExperimentDataGroup[];

    
}
