import { TestReportObject } from '../../models';
import { TestReport } from '../../../../shared/models';


export interface TestReportDataService {
    configure(): void;
    all(): TestReportObject[];
    all(algorithmId : number): TestReportObject[];
    allView(): TestReport[];
    view(id: number): TestReport;
    post(report: TestReportObject): TestReportObject;
    get(id: number): TestReportObject;
    update(report: TestReportObject): void;
    delete(id: number): void;
    deleteByAlgorithm(id: number): number[];
    load(algorithmId: number);
    save(algorithmId: number);
    show(id: number): void;
}






