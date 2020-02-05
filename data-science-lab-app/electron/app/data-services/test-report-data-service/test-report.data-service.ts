import { TestReportViewModel } from '../../../../shared/view-models';

export interface TestReportDataService {
    all(): TestReportViewModel[];
    create(report: TestReportViewModel): TestReportViewModel;
    read(id: number): TestReportViewModel;
    update(report: TestReportViewModel): void;
    delete(id: number): void;
}
