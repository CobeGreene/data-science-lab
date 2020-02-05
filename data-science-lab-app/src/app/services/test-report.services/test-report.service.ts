
import { Subject } from 'rxjs';
import { TestReportViewModel } from '../../../../shared/view-models';

export abstract class TestReportService {
    public testReportsChanged: Subject<TestReportViewModel[]>;

    constructor() {
        this.testReportsChanged = new Subject<TestReportViewModel[]>();
    }

    abstract all(algorithmId: number): TestReportViewModel[];
    abstract get(id: number): TestReportViewModel;
}
