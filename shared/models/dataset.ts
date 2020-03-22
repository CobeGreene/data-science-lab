import { Feature } from './feature';

export interface Dataset {
    id: number;
    experimentId: number;
    name: string;
    features: Feature[];
    examples: number;
    previewExamples: any[][];
}
