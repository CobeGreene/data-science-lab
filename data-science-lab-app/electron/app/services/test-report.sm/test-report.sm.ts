import { ServiceContainer, SERVICE_TYPES } from '../../service-container';
import { ServiceModelRoutes, Producer, } from '../../pipeline';
import { TestReportEvents } from '../../../../shared/events';
import { ServiceModel } from '../service-model';
import { TestReportDataService } from '../../data-services/test-report-data-service';

export class TestReportServiceModel extends ServiceModel {
    static routes: ServiceModelRoutes = {
        service: SERVICE_TYPES.TestReportServiceModel,
        routes: [
            { path: TestReportEvents.All, method: 'all' },
            { path: TestReportEvents.Rename, method: 'rename' },
            { path: TestReportEvents.Delete, method: 'delete' },
        ]
    };

    private dataService: TestReportDataService;

    constructor(serviceContainer: ServiceContainer, producer: Producer) {
        super(serviceContainer, producer);

        this.dataService = serviceContainer.resolve<TestReportDataService>(SERVICE_TYPES.TestReportDataService);
    }

    all() {
        this.producer.send(TestReportEvents.All, this.dataService.all());
    }

    rename(id: number, name: string) {
        const report = this.dataService.get(id);
        report.name = name;
        this.dataService.update(report);
        this.producer.send(TestReportEvents.Update, report);
    }

    delete(id: number) {
        this.dataService.delete(id);
        this.producer.send(TestReportEvents.Delete, id);
    }
}

