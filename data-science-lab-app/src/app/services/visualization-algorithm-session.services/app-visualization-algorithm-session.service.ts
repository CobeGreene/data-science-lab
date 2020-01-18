import { Injectable, OnDestroy, NgZone } from '@angular/core';
import { VisualizationAlgorithmSessionService } from './visualization-algorithm-session.service';
import { VisualizationSessionViewModel, VisualizationPluginViewModel } from '../../../../shared/view-models';
import { IpcService } from '../../../../shared/services';
import { ExperimentsEvents } from '../../../../shared/events';

@Injectable()
export class AppVisualizationAlgorithmSessionService extends VisualizationAlgorithmSessionService implements OnDestroy {

    private visualizationSessions: VisualizationSessionViewModel[];

    constructor(private ipcService: IpcService, private zone: NgZone) {
        super();

        this.visualizationSessions = [];

        this.registerEvents();
        this.ipcService.send(ExperimentsEvents.GetAllVisualizationAlgorithmSessionsEvent);
    }

    private registerEvents() {
        this.ipcService.on(ExperimentsEvents.GetAllVisualizationAlgorithmSessionsListeners, this.getAllEvent);
        this.ipcService.on(ExperimentsEvents.CreateVisualizationAlgorithmSessionListeners, this.createEvent);
        this.ipcService.on(ExperimentsEvents.DeleteVisualizationAlgorithmSessionListeners, this.deleteEvent);
        this.ipcService.on(ExperimentsEvents.UpdatedVisualizationAlgorithmSessionListeners, this.updatedEvent);
        this.ipcService.on(ExperimentsEvents.FinishedVisualizationAlgorithmSessionListeners, this.finishedEvent);
    }

    private findSessionIndex(id: number) {
        return this.visualizationSessions.findIndex((value) => {
            return value.id === id;
        });
    }


    private finishedEvent = (event: string, id: number): void => {
        this.zone.run(() => {
            const findIndex = this.findSessionIndex(id);
            if (findIndex >= 0) {
                this.visualizationSessions.splice(findIndex, 1);
            }            
            this.sessionFinished.next(id);
        });
    }


    private updatedEvent = (event: string, session: VisualizationSessionViewModel) => {
        this.zone.run(() => {
            const findIndex = this.findSessionIndex(session.id);
            if (findIndex >= 0) {
                this.visualizationSessions[findIndex] = session;
            }
            this.sessionUpdated.next(session);
        });
    }
    private deleteEvent = (event: string, id: number): void => {
        this.zone.run(() => {
            const findIndex = this.findSessionIndex(id);
            if (findIndex >= 0) {
                this.visualizationSessions.splice(findIndex, 1);
            }
            this.sessionDeleted.next(id);
        });
    }

    private createEvent = (event: string, session: VisualizationSessionViewModel) => {
        this.zone.run(() => {
            if (!this.hasSession(session.id)) {
                this.visualizationSessions.push(session);
            }
            this.newSession.next(session);
        });
    }

    private getAllEvent = (event: string, sessions: VisualizationSessionViewModel[]) => {
        this.zone.run(() => {
            this.visualizationSessions = sessions;
        });
    }

    ngOnDestroy(): void {
        this.ipcService.removeListener(ExperimentsEvents.GetAllVisualizationAlgorithmSessionsListeners, this.getAllEvent);
        this.ipcService.removeListener(ExperimentsEvents.CreateVisualizationAlgorithmSessionListeners, this.createEvent);
        this.ipcService.removeListener(ExperimentsEvents.DeleteVisualizationAlgorithmSessionListeners, this.deleteEvent);
        this.ipcService.removeListener(ExperimentsEvents.UpdatedVisualizationAlgorithmSessionListeners, this.updatedEvent);
        this.ipcService.removeListener(ExperimentsEvents.FinishedVisualizationAlgorithmSessionListeners, this.finishedEvent);
    }

    get(id: number): VisualizationSessionViewModel {
        const findIndex = this.findSessionIndex(id);
        if (findIndex >= 0) {
            return this.visualizationSessions[findIndex];
        }
        throw new Error(`Couldn't find visualization session with algorithm id ${id}`);
    }

    hasSession(dataGroupId: number): boolean {
        return this.findSessionIndex(dataGroupId) >= 0;
    }
    
    create(id: number, plugin: VisualizationPluginViewModel, inputs: {[id: string]: number[]}): void {
        this.ipcService.send(ExperimentsEvents.CreateVisualizationAlgorithmSessionEvent, id, plugin, inputs);
    }

    delete(id: number): void {
        this.ipcService.send(ExperimentsEvents.DeleteVisualizationAlgorithmSessionEvent, id);
    }

    submitOptions(id: number, inputs: { [id: string]: any; }): void {
        this.ipcService.send(ExperimentsEvents.SubmitOptionsVisualizationAlgorithmSessionEvent, id, inputs);
    }

    executeCommand(id: number, command: string): void {
        this.ipcService.send(ExperimentsEvents.ExecuteCommandVisualizationAlgorithmSessionEvent, id, command);
    }
}
