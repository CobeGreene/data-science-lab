import { TestReport } from '../../../../shared/models';


export interface TestReportDataService {
    configure(): void;
    all(): TestReport[];
    post(report: TestReport): TestReport;
    get(id: number): TestReport;
    update(report: TestReport): void;
    delete(id: number): void;
    deleteByAlgorithm(id: number): number[];
    load(algorithmId: number);
    save(algorithmId: number);
}






