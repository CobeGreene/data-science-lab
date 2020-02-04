import { BaseProducer } from '../base.producer';
import { AlgorithmTestingSessionProducer } from './algorithm-testing-session.producer';
import { TestingSessionViewModel } from '../../../../shared/view-models';
import { ExperimentsEvents } from '../../../../shared/events';


export class AppAlgorithmTestingSessionProducer extends BaseProducer implements AlgorithmTestingSessionProducer {
    all(sessions: TestingSessionViewModel[]): void {
        this.ipc.send(ExperimentsEvents.GetAllAlgorithmTestingSessionsListeners, sessions);
    }    
    
    newSession(session: TestingSessionViewModel): void {
        this.ipc.send(ExperimentsEvents.NewAlgorithmTestingSessionListener, session);
    }
    
    finishSession(id: number): void {
        this.ipc.send(ExperimentsEvents.FinishedAlgorithmTestingSessionListener, id);
    }


}

