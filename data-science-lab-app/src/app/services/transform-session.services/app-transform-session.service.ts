import { Injectable, OnDestroy, NgZone } from '@angular/core';
import { TransformSessionService } from './transform-session.service';
import { TransformSessionViewModel } from '../../../../shared/view-models';
import { IpcService } from '../../../../shared/services';
import { Plugin, SelectTransformPlugin } from '../../../../shared/models';
import { ExperimentsEvents } from '../../../../shared/events';

@Injectable()
export class AppTransformSessionService extends TransformSessionService implements OnDestroy {

    private transformSessions: TransformSessionViewModel[];

    constructor(private ipcService: IpcService, private zone: NgZone) {
        super();

        this.transformSessions = [];

        this.registerEvents();
        this.ipcService.send(ExperimentsEvents.GetAllTransformSessionsEvent);
    }

    private registerEvents() {
        this.ipcService.on(ExperimentsEvents.GetAllTransformSessionsListeners, this.getAllEvent);
        this.ipcService.on(ExperimentsEvents.CreateTransformSessionListeners, this.createEvent);
        this.ipcService.on(ExperimentsEvents.DeleteTransformSessionListeners, this.deleteEvent);
        this.ipcService.on(ExperimentsEvents.UpdatedTransformSessionListeners, this.updatedEvent);
        this.ipcService.on(ExperimentsEvents.FinishedTransformSessionListeners, this.finishedEvent);
    }

    private findSessionIndex(experimentId: number, dataGroupId: number) {
        return this.transformSessions.findIndex((value) => {
            return value.experimentId === experimentId &&
                value.dataGroupId === dataGroupId;
        });
    }


    private finishedEvent = (event: string, experimentId: number, dataGroupId: number): void => {
        this.zone.run(() => {
            const findIndex = this.findSessionIndex(experimentId, dataGroupId);
            if (findIndex >= 0) {
                this.transformSessions.splice(findIndex, 1);
            }            
            this.sessionFinished.next({experimentId, dataGroupId});
        });
    }


    private updatedEvent = (event: string, session: TransformSessionViewModel) => {
        this.zone.run(() => {
            const findIndex = this.findSessionIndex(session.experimentId, session.dataGroupId);
            if (findIndex >= 0) {
                this.transformSessions[findIndex] = session;
            }
            this.sessionUpdated.next(session);
        });
    }
    private deleteEvent = (event: string, experimentId: number, dataGroupId: number): void => {
        this.zone.run(() => {
            const findIndex = this.findSessionIndex(experimentId, dataGroupId);
            if (findIndex >= 0) {
                this.transformSessions.splice(findIndex, 1);
            }
            this.sessionDeleted.next({experimentId, dataGroupId});
        });
    }

    private createEvent = (event: string, session: TransformSessionViewModel) => {
        this.zone.run(() => {
            if (!this.hasSession(session.experimentId, session.dataGroupId)) {
                this.transformSessions.push(session);
            }
            this.newSession.next(session);
        });
    }

    private getAllEvent = (event: string, sessions: TransformSessionViewModel[]) => {
        this.zone.run(() => {
            this.transformSessions = sessions;
        });
    }

    ngOnDestroy(): void {
        this.ipcService.removeListener(ExperimentsEvents.GetAllTransformSessionsListeners, this.getAllEvent);
        this.ipcService.removeListener(ExperimentsEvents.CreateTransformSessionListeners, this.createEvent);
        this.ipcService.removeListener(ExperimentsEvents.DeleteTransformSessionListeners, this.deleteEvent);
        this.ipcService.removeListener(ExperimentsEvents.UpdatedTransformSessionListeners, this.updatedEvent);
        this.ipcService.removeListener(ExperimentsEvents.FinishedTransformSessionListeners, this.finishedEvent);
    }

    get(experimentId: number, dataGroupId: number): TransformSessionViewModel {
        const findIndex = this.findSessionIndex(experimentId, dataGroupId);
        if (findIndex >= 0) {
            return this.transformSessions[findIndex];
        }
        throw new Error(`Couldn't find transform session with experiment id ${experimentId} and data group id ${dataGroupId}`);
    }

    hasSession(experimentId: number, dataGroupId: number): boolean {
        return this.findSessionIndex(experimentId, dataGroupId) >= 0;
    }
    
    create(experimentId: number, dataGroupId: number, plugin: SelectTransformPlugin): void {
        this.ipcService.send(ExperimentsEvents.CreateTransformSessionEvent, experimentId, dataGroupId, plugin);
    }

    delete(experimentId: number, dataGroupId: number): void {
        this.ipcService.send(ExperimentsEvents.DeleteTransformSessionEvent, experimentId, dataGroupId);
    }

    submitOptions(experimentId: number, dataGroupId: number, inputs: { [id: string]: any; }): void {
        this.ipcService.send(ExperimentsEvents.SubmitOptionsTransformSessionEvent, experimentId, dataGroupId, inputs);
    }

    executeCommand(experimentId: number, dataGroupId: number, command: string): void {
        this.ipcService.send(ExperimentsEvents.ExecuteCommandTransformSessionEvent, experimentId, dataGroupId, command);
    }
}
