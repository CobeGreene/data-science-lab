import { FeatureObject } from "./feature.obj";


export interface TestReportObject {
    id: number;
    name: string;
    algorithmId: number;
    datasetId: number;
    iteration: number;
    correct: number;
    total: number;
    features: FeatureObject[];
    previewExamples?: number;
}

