import { Injectable, OnDestroy, NgZone } from '@angular/core';
import { VisualizationsService } from './visualizations.service';
import { Visualization } from '../../../../shared/models';
import { IpcService } from '../../../../shared/services';
import { ExperimentsEvents } from '../../../../shared/events';


@Injectable()
export class AppVisualizationsService extends VisualizationsService implements OnDestroy {

    private visualizations: Visualization[];

    constructor(private ipcService: IpcService, private zone: NgZone) {
        super();

        this.visualizations = [];
        this.registerEvents();
        this.ipcService.send(ExperimentsEvents.GetAllVisualizationsEvent);
    }

    registerEvents() {
        this.ipcService.on(ExperimentsEvents.GetAllVisualizationsListeners, this.getAllEvent);
        this.ipcService.on(ExperimentsEvents.NewVisualizationsListeners, this.newEvent);    
        this.ipcService.on(ExperimentsEvents.DeleteVisualizationsListeners, this.deletedEvent);
        this.ipcService.on(ExperimentsEvents.UpdatedVisualizationsListeners, this.updatedEvent);
    }


    newEvent = (event, visual: Visualization) => {
        this.zone.run(() => {
            this.visualizations.push(visual);
            this.newVisualization.next(visual);
        });
    }


    updatedEvent = (event, visual: Visualization) => {
        this.zone.run(() => {
            const findIndex = this.visualizations.findIndex((value) => {
                return value.id === visual.id;
            });
            if (findIndex >= 0) {
                this.visualizations[findIndex] = visual;
            }
            this.updatedVisualization.next(visual);
        });
    }

    deletedEvent = (event, id: number) => {
        this.zone.run(() => {
            const findIndex = this.visualizations.findIndex((value) => {
                return value.id === id;
            });
            if (findIndex >= 0) {
                this.visualizations.splice(findIndex, 1);
            }
            this.deletedVisualization.next(id);
        });
    }

    getAllEvent = (event, visuals: Visualization[]) => {
        this.zone.run(() => {
            this.visualizations = visuals;
        });
    }

    ngOnDestroy() {
        this.ipcService.removeListener(ExperimentsEvents.GetAllVisualizationsListeners, this.getAllEvent);
        this.ipcService.removeListener(ExperimentsEvents.NewVisualizationsListeners, this.newEvent);    
        this.ipcService.removeListener(ExperimentsEvents.DeleteVisualizationsListeners, this.deletedEvent);
        this.ipcService.removeListener(ExperimentsEvents.UpdatedVisualizationsListeners, this.updatedEvent);
    }

    all(experimentId: number): Visualization[] {
        const experimentDataGroups = this.visualizations.filter((value) => {
            return value.experimentId === experimentId;
        });
        return experimentDataGroups;
    }

    get(id: number): Visualization {
        const find = this.visualizations.find((value) => {
            return value.id === id;
        });

        if (find) {
            return find;
        }
        throw new Error(`Couldn't find visuals with id ${id}.`);
    }

    delete(id: number) {
        this.ipcService.send(ExperimentsEvents.DeleteVisualizationsEvent, id);
    }
}
