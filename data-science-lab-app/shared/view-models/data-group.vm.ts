

export class DataGroupViewModel {

    public id: number;
    public label: string;
    public experimentId: number;
    public numOfExamples: number;
    public numOfFeatures: number;

    public features: string[];
    public featureTypes: string[];
    public previewExamples: any[][];
    public previewFeatures: string[];
    public previewFeatureTypes: string[];

    constructor(dataGroup: {
        id: number,
        experimentId: number,
        label: string,
        numOfExamples: number,
        numOfFeatures: number,
        features?: string[],
        featureTypes?: string[],
        previewExamples?: any[][]
    }) {
        this.id = dataGroup.id;
        this.label = dataGroup.label;
        this.experimentId = dataGroup.experimentId;
        this.numOfExamples = dataGroup.numOfExamples;
        this.numOfFeatures = dataGroup.numOfFeatures;

        this.previewExamples = dataGroup.previewExamples || [];
        this.features = dataGroup.features || [];
        this.featureTypes = dataGroup.featureTypes || [];
        const length = this.previewExamples[0] ? this.previewExamples[0].length : 0;
        this.previewFeatures = [];
        this.previewFeatureTypes = [];
        for (let i = 0; i < length; ++i) {
            this.previewFeatures.push(this.features[i]);
            this.previewFeatureTypes.push(this.featureTypes[i]);
        }
    }
}

