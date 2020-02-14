import { TestReportViewModel } from '../../../../shared/view-models';

export interface TestReportDataService {
    all(algorithmId?: number): TestReportViewModel[];
    create(report: TestReportViewModel): TestReportViewModel;
    read(id: number): TestReportViewModel;
    update(report: TestReportViewModel): void;
    delete(id: number): void;
    load(reports: TestReportViewModel[]): void;
}
