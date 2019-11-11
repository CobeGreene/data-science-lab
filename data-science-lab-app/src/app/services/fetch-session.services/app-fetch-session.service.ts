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


}
