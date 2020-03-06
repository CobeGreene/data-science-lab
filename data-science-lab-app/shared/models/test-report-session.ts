import { SessionOptions } from './session-options';
import { PluginDataInput } from 'data-science-lab-core';

export interface TestReportSession {
    id: number;
    algorithmId: number;
    state: string;
    sessionOptions: SessionOptions;
    datasetId?: number;
    inputDict?: { [id: string]: number[] };
    returnPath?: string;
    selectedFeatures?: number[];
    inputs: PluginDataInput[];
    isWaiting: boolean;
}
