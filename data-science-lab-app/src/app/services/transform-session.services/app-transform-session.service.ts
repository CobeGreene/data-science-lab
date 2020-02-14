import { Injectable, OnDestroy, NgZone } from '@angular/core';
import { TransformSessionService } from './transform-session.service';
import { TransformSessionViewModel, TransformPluginViewModel } from '../../../../shared/view-models';
import { IpcService } from '../../../../shared/services';
import { Plugin } from '../../../../shared/models';
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

    private findSessionIndex(dataGroupId: number) {
        return this.transformSessions.findIndex((value) => {
            return value.dataGroupId === dataGroupId;
        });
    }


    private finishedEvent = (event: string, dataGroupId: number): void => {
        this.zone.run(() => {
            const findIndex = this.findSessionIndex(dataGroupId);
            if (findIndex >= 0) {
                this.transformSessions.splice(findIndex, 1);
            }            
            this.sessionFinished.next(dataGroupId);
        });
    }


    private updatedEvent = (event: string, session: TransformSessionViewModel) => {
        this.zone.run(() => {
            const findIndex = this.findSessionIndex(session.dataGroupId);
            if (findIndex >= 0) {
                this.transformSessions[findIndex] = session;
            }
            this.sessionUpdated.next(session);
        });
    }
    private deleteEvent = (event: string, dataGroupId: number): void => {
        this.zone.run(() => {
            const findIndex = this.findSessionIndex(dataGroupId);
            if (findIndex >= 0) {
                this.transformSessions.splice(findIndex, 1);
            }
            this.sessionDeleted.next(dataGroupId);
        });
    }

    private createEvent = (event: string, session: TransformSessionViewModel) => {
        this.zone.run(() => {
            if (!this.hasSession(session.dataGroupId)) {
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

    get(dataGroupId: number): TransformSessionViewModel {
        const findIndex = this.findSessionIndex(dataGroupId);
        if (findIndex >= 0) {
            return this.transformSessions[findIndex];
        }
        throw new Error(`Couldn't find transform session with data group id ${dataGroupId}`);
    }

    hasSession(dataGroupId: number): boolean {
        return this.findSessionIndex(dataGroupId) >= 0;
    }
    
    create(dataGroupId: number, plugin: TransformPluginViewModel, inputs: {[id: string]: number[]}): void {
        this.ipcService.send(ExperimentsEvents.CreateTransformSessionEvent, dataGroupId, plugin, inputs);
    }

    delete(dataGroupId: number): void {
        this.ipcService.send(ExperimentsEvents.DeleteTransformSessionEvent, dataGroupId);
    }

    submitOptions(dataGroupId: number, inputs: { [id: string]: any; }): void {
        this.ipcService.send(ExperimentsEvents.SubmitOptionsTransformSessionEvent, dataGroupId, inputs);
    }

    executeCommand(dataGroupId: number, command: string): void {
        this.ipcService.send(ExperimentsEvents.ExecuteCommandTransformSessionEvent, dataGroupId, command);
    }
}
