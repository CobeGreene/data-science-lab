import { TestReportProducer } from './test-report.producer';
import { BaseProducer } from '../base.producer';
import { TestReportViewModel } from '../../../../shared/view-models';
import { ExperimentsEvents } from '../../../../shared/events';


export class AppTestReportProducer extends BaseProducer implements TestReportProducer {

    all(reports: TestReportViewModel[]) {
        this.ipc.send(ExperimentsEvents.GetAllTestReportListeners, reports);
    }
}
