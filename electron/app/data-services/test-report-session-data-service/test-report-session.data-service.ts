import { TestReportSession } from '../../../../shared/models';

export interface TestReportSessionDataService {
    all(): TestReportSession[];
    post(session: TestReportSession): TestReportSession;
    get(id: number): TestReportSession;
    update(session: TestReportSession): void;
    delete(id: number): void;
}


