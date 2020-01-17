import { Injectable, OnDestroy, NgZone } from '@angular/core';
import { AlgorithmSessionService } from './algorithm-session.service';
import { IpcService } from '../../../../shared/services';
import { ExperimentsEvents } from '../../../../shared/events';
import { AlgorithmPluginViewModel, AlgorithmSessionViewModel } from '../../../../shared/view-models';


@Injectable()
export class AppAlgorithmSessionService extends AlgorithmSessionService implements OnDestroy {

    private algorithmSessions: AlgorithmSessionViewModel[];

    constructor(private ipcService: IpcService, private zone: NgZone) {
        super();

        this.algorithmSessions = [];

        this.registerEvents();
        this.ipcService.send(ExperimentsEvents.GetAllAlgorithmSessionsEvent);
    }

    private registerEvents() {
        this.ipcService.on(ExperimentsEvents.GetAllAlgorithmSessionsListeners, this.getAllEvent);
        this.ipcService.on(ExperimentsEvents.CreateAlgorithmSessionListeners, this.createEvent);
        this.ipcService.on(ExperimentsEvents.DeleteAlgorithmSessionListeners, this.deleteEvent);
        this.ipcService.on(ExperimentsEvents.UpdatedAlgorithmSessionListeners, this.updatedEvent);
        this.ipcService.on(ExperimentsEvents.FinishedAlgorithmSessionListeners, this.finishedEvent);
    }

    private findSessionIndex(dataGroupId: number) {
        return this.algorithmSessions.findIndex((value) => {
            return value.dataGroupId === dataGroupId;
        });
    }


    private finishedEvent = (event: string, dataGroupId: number): void => {
        this.zone.run(() => {
            const findIndex = this.findSessionIndex(dataGroupId);
            if (findIndex >= 0) {
                this.algorithmSessions.splice(findIndex, 1);
            }            
            this.sessionFinished.next(dataGroupId);
        });
    }


    private updatedEvent = (event: string, session: AlgorithmSessionViewModel) => {
        this.zone.run(() => {
            const findIndex = this.findSessionIndex(session.dataGroupId);
            if (findIndex >= 0) {
                this.algorithmSessions[findIndex] = session;
            }
            this.sessionUpdated.next(session);
        });
    }
    private deleteEvent = (event: string, dataGroupId: number): void => {
        this.zone.run(() => {
            const findIndex = this.findSessionIndex(dataGroupId);
            if (findIndex >= 0) {
                this.algorithmSessions.splice(findIndex, 1);
            }
            this.sessionDeleted.next(dataGroupId);
        });
    }

    private createEvent = (event: string, session: AlgorithmSessionViewModel) => {
        this.zone.run(() => {
            if (!this.hasSession(session.dataGroupId)) {
                this.algorithmSessions.push(session);
            }
            this.newSession.next(session);
        });
    }

    private getAllEvent = (event: string, sessions: AlgorithmSessionViewModel[]) => {
        this.zone.run(() => {
            this.algorithmSessions = sessions;
        });
    }

    ngOnDestroy(): void {
        this.ipcService.removeListener(ExperimentsEvents.GetAllAlgorithmSessionsListeners, this.getAllEvent);
        this.ipcService.removeListener(ExperimentsEvents.CreateAlgorithmSessionListeners, this.createEvent);
        this.ipcService.removeListener(ExperimentsEvents.DeleteAlgorithmSessionListeners, this.deleteEvent);
        this.ipcService.removeListener(ExperimentsEvents.UpdatedAlgorithmSessionListeners, this.updatedEvent);
        this.ipcService.removeListener(ExperimentsEvents.FinishedAlgorithmSessionListeners, this.finishedEvent);
    }

    get(dataGroupId: number): AlgorithmSessionViewModel {
        const findIndex = this.findSessionIndex(dataGroupId);
        if (findIndex >= 0) {
            return this.algorithmSessions[findIndex];
        }
        throw new Error(`Couldn't find transform session with data group id ${dataGroupId}`);
    }

    hasSession(dataGroupId: number): boolean {
        return this.findSessionIndex(dataGroupId) >= 0;
    }
    
    create(dataGroupId: number, plugin: AlgorithmPluginViewModel, inputs: {[id: string]: number[]}): void {
        this.ipcService.send(ExperimentsEvents.CreateAlgorithmSessionEvent, dataGroupId, plugin, inputs);
    }

    delete(dataGroupId: number): void {
        this.ipcService.send(ExperimentsEvents.DeleteAlgorithmSessionEvent, dataGroupId);
    }

    submitOptions(dataGroupId: number, inputs: { [id: string]: any; }): void {
        this.ipcService.send(ExperimentsEvents.SubmitOptionsAlgorithmSessionEvent, dataGroupId, inputs);
    }

    executeCommand(dataGroupId: number, command: string): void {
        this.ipcService.send(ExperimentsEvents.ExecuteCommandAlgorithmSessionEvent, dataGroupId, command);
    }
}
