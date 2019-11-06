import { ExperimentFeatureTypes } from './experiment-feature-types';

export abstract class ExperimentFeature {
    public name: string;
    public type: ExperimentFeatureTypes;
    public examples: any[];

    constructor(feature: { 
        name: string, type: ExperimentFeatureTypes, examples: any[]
    }) {
        this.name = feature.name;
        this.type = feature.type;
        this.examples = feature.examples;
    }
}
