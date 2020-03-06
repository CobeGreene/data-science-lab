import { SessionOptions } from './session-options';
import { PluginDataInput } from 'data-science-lab-core';
import { Plugin } from './plugin';

export interface TestReportSession {
    id: number;
    algorithmId: number;
    state: string;
    sessionOptions: SessionOptions;
    plugin: Plugin;
    datasetId?: number;
    inputDict?: { [id: string]: number[] };
    returnPath?: string;
    selectedFeatures?: number[];
    inputs: PluginDataInput[];
    isWaiting: boolean;
}
