import { ExperimentFeature } from './experiment-feature';
import { ExperimentFeatureTypes } from './experiment-feature-types';


export class ExperimentNumberFeature extends ExperimentFeature {
    examples: number[]; 

    constructor(feature: {
        name: string, examples: number[]
    }) {
        super({
            name: feature.name,
            type: ExperimentFeatureTypes.Number,
            examples: feature.examples
        });
    }
}
