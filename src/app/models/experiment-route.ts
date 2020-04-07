export interface ExperimentRoute {
    id: number;
    prefix: string;
    datasetId?: number;
    algorithmId?: number;
    sessionId?: number;
    testReportId?: number;
}
