
export class ExperimentFeature {
    public name: string;
    public type: string;
    public examples: any[];

    constructor(feature?: { 
        name: string, type: string, examples: any[]
    }) {
        if (feature) {
            this.name = feature.name;
            this.type = feature.type;
            this.examples = feature.examples;
        } else {
            this.name = '';
            this.type = '';
            this.examples = [];
        }
    }

}
