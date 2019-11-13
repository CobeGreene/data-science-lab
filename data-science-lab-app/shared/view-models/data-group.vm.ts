

export class DataGroupViewModel {

    public id: number;
    public experimentId: number;
    public numOfExamples: number;
    public numOfFeatures: number;

    public previewFeatures: string[];
    public previewExamples: any[][];

    constructor(dataGroup: {
        id: number,
        experimentId: number,
        numOfExamples: number,
        numOfFeatures: number,
        previewFeatures?: string[],
        previewExamples?: any[][]
    }) {
        this.id = dataGroup.id;
        this.experimentId = dataGroup.experimentId;
        this.numOfExamples = dataGroup.numOfExamples;
        this.numOfFeatures = dataGroup.numOfFeatures;

        this.previewExamples = dataGroup.previewExamples || [];
        this.previewFeatures = dataGroup.previewFeatures || [];
    }
}

