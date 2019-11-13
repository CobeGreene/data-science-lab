

export class DataGroupViewModel {

    public id: number;
    public label: string;
    public experimentId: number;
    public numOfExamples: number;
    public numOfFeatures: number;

    public previewFeatures: string[];
    public previewFeautureTypes: string[];
    public previewExamples: any[][];

    constructor(dataGroup: {
        id: number,
        experimentId: number,
        label: string,
        numOfExamples: number,
        numOfFeatures: number,
        previewFeatures?: string[],
        previewFeatureTypes?: string[],
        previewExamples?: any[][]
    }) {
        this.id = dataGroup.id;
        this.label = dataGroup.label;
        this.experimentId = dataGroup.experimentId;
        this.numOfExamples = dataGroup.numOfExamples;
        this.numOfFeatures = dataGroup.numOfFeatures;

        this.previewExamples = dataGroup.previewExamples || [];
        this.previewFeatures = dataGroup.previewFeatures || [];
        this.previewFeautureTypes = dataGroup.previewFeatureTypes || [];
    }
}

