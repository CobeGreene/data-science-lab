import { TestReportService } from './test-report.service';
import { ServiceContainer, SERVICE_TYPES } from '../../services-container';
import { TestReportDataService } from '../../data-services';
import { TestReportProducer } from '../../producers';

export class AppTestReportService implements TestReportService {
    
    constructor(private serviceContainer: ServiceContainer) {

    }
    
    all(): void {
        const service = this.serviceContainer.resolve<TestReportDataService>(SERVICE_TYPES.TestReportDataService);
        const producer = this.serviceContainer.resolve<TestReportProducer>(SERVICE_TYPES.TestReportProducer);
        producer.all(service.all());
    }


}
