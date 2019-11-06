import { ExperimentFeature } from './experiment-feature';
import { ExperimentFeatureTypes } from './experiment-feature-types';


export class ExperimentBooleanFeature extends ExperimentFeature {
    examples: boolean[];

    constructor(feature: {
        name: string, examples: boolean[]
    }) {
        super({
            name: feature.name,
            type: ExperimentFeatureTypes.Boolean,
            examples: feature.examples
        });
    }
}
