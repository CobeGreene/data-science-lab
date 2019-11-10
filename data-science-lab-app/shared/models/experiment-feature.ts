
export class ExperimentFeature {
    public name: string;
    public types: string[];
    public examples: any[];

    constructor(feature: { 
        name: string, types: string[], examples: any[]
    }) {
        this.name = feature.name;
        this.types = feature.types;
        this.examples = feature.examples;
    }
}
