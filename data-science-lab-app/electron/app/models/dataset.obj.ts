import { FeatureObject } from './feature.obj';

export interface DatasetObject {
    id: number;
    experimentId: number;
    name: string;
    examples: number;
    features: FeatureObject[];
    previewExamples?: number;
}
