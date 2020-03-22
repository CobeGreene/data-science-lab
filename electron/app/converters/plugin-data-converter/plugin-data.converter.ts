import { PluginData } from 'data-science-lab-core';
import { DatasetObject } from '../../models';

export interface PluginDataConverter {
    convert(data: PluginData): DatasetObject[];
}
