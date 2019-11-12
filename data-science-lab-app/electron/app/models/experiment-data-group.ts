import { ExperimentFeature } from './experiment-feature';

export class ExperimentDataGroup {
    public id: number;
    public label: string;
    public examples: number;
    public features: ExperimentFeature[];
    public experimentId: number;

    constructor(dataGroup: {
        id?: number, label: string, experimentId?: number
    }) {
        this.id = dataGroup.id || 0;
        this.label = dataGroup.label;
        this.examples = 0;
        this.features = [];
        this.experimentId = dataGroup.experimentId || 0;
    }

    public add(feature: ExperimentFeature) {
        if (this.features.length === 0) {
            this.features.push(feature);
            this.examples = feature.examples.length;
        } else if (this.examples !== feature.examples.length) {
            throw new Error(`Feature has ${feature.examples.length} which doesn't match groups ${this.examples} examples.`);
        } else {
            this.features.push(feature);
        }
    }
}


