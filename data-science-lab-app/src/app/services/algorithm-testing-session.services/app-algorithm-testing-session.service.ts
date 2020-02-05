import { AlgorithmTestingSessionService } from './algorithm-testing-session.service';
import { TestingSessionViewModel } from '../../../../shared/view-models';
import { IpcService } from '../../../../shared/services';
import { NgZone, Injectable } from '@angular/core';
import { ExperimentsEvents } from '../../../../shared/events';


@Injectable()
export class AppAlgorithmTestingSessionService extends AlgorithmTestingSessionService {

    private sessions: TestingSessionViewModel[];

    constructor(private ipcService: IpcService, private zone: NgZone) {
        super();

        this.sessions = [];
        this.registerEvents();
        this.ipcService.send(ExperimentsEvents.GetAllAlgorithmTestingSessionsEvent);
    }

    private registerEvents() {
        this.ipcService.on(ExperimentsEvents.GetAllAlgorithmTestingSessionsListeners, this.getAll);
        this.ipcService.on(ExperimentsEvents.NewAlgorithmTestingSessionListener, this.newSession);
        this.ipcService.on(ExperimentsEvents.FinishedAlgorithmTestingSessionListener, this.finishSession);
    }

    getAll = (event: string, sessions: TestingSessionViewModel[]) => {
        this.zone.run(() => {
            this.sessions = sessions;
        });
    }

    newSession = (event: string, session: TestingSessionViewModel) => {
        this.zone.run(() => {
            this.sessions.push(session);
            this.newTestingSession.next(session);
        });
    }

    finishSession = (event: string, id: number) => {
        this.zone.run(() => {
            const index = this.sessions.findIndex((value) => {
                return value.id === id; 
            });
            this.sessions.splice(index, 1);
            this.testingSessionFinish.next(id);
        });
    }


    requestTest(id: number, dataGroupId: number): void {
        this.ipcService.send(ExperimentsEvents.RequestAlgorithmTestingSessionEvent, id, dataGroupId);
    }

    get(id: number): TestingSessionViewModel {
        const find = this.sessions.find((value) => {
            return value.id === id;
        });
        if (find) {
            return find;
        }
        throw new Error(`Couldn't find session with algorithm id: ${id}`);
    }

    startTest(id: number, inputs: { [id: string]: number[]; }, output: { [id: string]: number[]; }): void {
        this.ipcService.send(ExperimentsEvents.StartAlgorithmTestingSessionEvent, id, inputs, output);
    }


}


