export interface TestReport {
    id: number;
    name: string;
    algorithmId: number;
    datasetId: number;
    datasetName: string;
    correct: number;
    total: number;
    iteration: number;
}

