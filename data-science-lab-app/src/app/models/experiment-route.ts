export interface ExperimentRoute {
    id: number;
    title: string;
    prefix: string;
    datasetId?: number;
    algorithmId?: number;
    sessionId?: number;
}
