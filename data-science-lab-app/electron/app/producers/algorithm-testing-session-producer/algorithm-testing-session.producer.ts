import { Producer } from '../producer';
import { TestingSessionViewModel, TestReportViewModel } from '../../../../shared/view-models';


export interface AlgorithmTestingSessionProducer extends Producer {

    all(sessions: TestingSessionViewModel[]): void;
    newSession(session: TestingSessionViewModel): void;
    finishSession(id: number): void;
    newReport(report: TestReportViewModel): void;
}

