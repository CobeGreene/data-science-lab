import { Producer } from '../producer';
import { TestReportViewModel } from '../../../../shared/view-models';

export interface TestReportProducer extends Producer {
    all(reports: TestReportViewModel[]): void;
}
