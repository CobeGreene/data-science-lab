import { SessionOptions } from './session-options';

export interface TestReportSession {
    id: number;
    algorithmId: number;
    state: string;
    sessionOptions: SessionOptions;
    datasetId?: number;
    inputDict?: { [id: string]: number[] };
    returnPath?: string;
    selectedFeatures?: number[];
}
