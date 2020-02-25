import { Plugin } from './plugin';
import { PluginDataInput } from 'data-science-lab-core';

export interface SessionPlugin extends Plugin {
    inputs: PluginDataInput[];
} 
