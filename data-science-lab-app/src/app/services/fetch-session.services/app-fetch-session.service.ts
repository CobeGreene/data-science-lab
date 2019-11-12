import { FetchSessionService } from './fetch-session.service';
import { Plugin } from '../../../../shared/models';
import { FetchSessionViewModel } from '../../../../shared/view-models';
import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { IpcService } from '../../../../shared/services';
import { ExperimentsEvents } from '../../../../shared/events';

@Injectable()
export class AppFetchSessionService extends FetchSessionService implements OnDestroy {
    
    private fetchSessions: FetchSessionViewModel[];
    
    constructor(private ipcService: IpcService, private zone: NgZone) {
        super();
        
        this.fetchSessions = [];

        this.registerEvents();
        this.ipcService.send(ExperimentsEvents.GetAllFetchSessionsEvent);
    }
    
    private registerEvents() {
        this.ipcService.on(ExperimentsEvents.GetAllFetchSessionsListeners, this.getAllEvent);
        this.ipcService.on(ExperimentsEvents.CreateFetchSessionListeners, this.createEvent);
        this.ipcService.on(ExperimentsEvents.DeleteFetchSessionListeners, this.deleteEvent);
        this.ipcService.on(ExperimentsEvents.UpdatedFetchSessionListeners, this.updateEvent);
        this.ipcService.on(ExperimentsEvents.FinishedFetchSessionListeners, this.finishEvent);
    }


    private finishEvent = (event: string, experimentId: number): void => {
        this.zone.run(() => {
            const findIndex = this.fetchSessions.findIndex((value) => {
                return value.experimentId === experimentId;
            });
            if (findIndex >= 0) {
                this.fetchSessions.splice(findIndex, 1);
            }
            this.sessionFinished.next(experimentId);
        });
    }

    private updateEvent = (event: string, fetchSession: FetchSessionViewModel): void => {
        this.zone.run(() => {
            const findIndex = this.fetchSessions.findIndex((value) => {
                return value.experimentId === fetchSession.experimentId;
            });
            if (findIndex >= 0) {
                this.fetchSessions[findIndex] = fetchSession;
            }
            this.sessionUpdated.next(fetchSession);
        });
    }


    private deleteEvent = (event: string, experimentId: number): void => {
        this.zone.run(() => {
            const findIndex = this.fetchSessions.findIndex((value) => {
                return value.experimentId === experimentId;
            });
            if (findIndex >= 0) {
                this.fetchSessions.splice(findIndex, 1);
            }
            this.sessionDeleted.next(experimentId);
        });
    }
    
    private getAllEvent = (event, fetchSessions: FetchSessionViewModel[]): void => {
        this.zone.run(() => {
            this.fetchSessions = fetchSessions;
        });
    }
    
    private createEvent = (event, fetchSession: FetchSessionViewModel) => {
        this.zone.run(() => {
            if (!this.hasSession(fetchSession.experimentId)) {
                this.fetchSessions.push(fetchSession);
            }
            this.newSession.next(fetchSession);
        });
    }

    ngOnDestroy() {
        this.ipcService.removeListener(ExperimentsEvents.GetAllFetchSessionsListeners, this.getAllEvent);
        this.ipcService.removeListener(ExperimentsEvents.CreateFetchSessionListeners, this.createEvent);
        this.ipcService.removeListener(ExperimentsEvents.DeleteFetchSessionListeners, this.deleteEvent);
        this.ipcService.removeListener(ExperimentsEvents.UpdatedFetchSessionListeners, this.updateEvent);
        this.ipcService.removeListener(ExperimentsEvents.FinishedFetchSessionListeners, this.finishEvent);
    }
    
    get(experimentId: number): FetchSessionViewModel {
        const find = this.fetchSessions.find((value) => {
            return value.experimentId === experimentId;
        });
        if (find) {
            return find;
        }
        throw new Error(`Couldn't find fetch session with experiment id ${experimentId}.`);
    }

    hasSession(experimentId: number): boolean {
        return this.fetchSessions.findIndex((value) => {
            return value.experimentId === experimentId;
        }) >= 0;
    }
    
    create(experimentId: number, plugin: Plugin) {
        this.ipcService.send(ExperimentsEvents.CreateFetchSessionEvent, experimentId, plugin);
    }
    
    delete(experimentId: number): void {
        this.ipcService.send(ExperimentsEvents.DeleteFetchSessionEvent, experimentId);
    }
    submitOptions(experimentId: number, inputs: { [id: string]: any; }): void {
        this.ipcService.send(ExperimentsEvents.SubmitOptionsFetchSessionEvent, experimentId, inputs);
    }

    executeCommand(experimentId: number, command: string): void {
        this.ipcService.send(ExperimentsEvents.ExecuteCommandFetchSessionEvent, experimentId, command);
    }

}
