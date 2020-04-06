import { Feature } from './feature';

export interface TestReport {
    id: number;
    name: string;
    algorithmId: number;
    datasetId: number;
    correct: number;
    total: number;
    iteration: number;
    features: Feature[];
    previewExamples: any[][];
}

