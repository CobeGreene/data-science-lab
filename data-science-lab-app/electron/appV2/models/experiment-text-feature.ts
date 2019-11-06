import { ExperimentFeature } from './experiment-feature';
import { ExperimentFeatureTypes } from './experiment-feature-types';


export class ExperimentTextFeature extends ExperimentFeature {

    examples: string[];

    constructor(feature: {
        name: string, examples: string[]
    }) {
        super({
            name: feature.name,
            type: ExperimentFeatureTypes.Text,
            examples: feature.examples
        });
    }
}
