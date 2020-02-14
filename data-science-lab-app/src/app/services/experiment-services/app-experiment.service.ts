import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { ExperimentService } from './experiment.service';
import { Experiment, ExperimentList } from '../../../../shared/models';
import { IpcService } from '../../../../shared/services';
import { ExperimentsEvents } from '../../../../shared/events';

@Injectable()
export class AppExperimentService extends ExperimentService implements OnDestroy {


    private retrieve: boolean;
    private experimentsList: ExperimentList;

    constructor(private ipcService: IpcService, private zone: NgZone) {
        super();

        this.retrieve = false;
        this.experimentsList = new ExperimentList();

        this.registerEvents();
    }

    private registerEvents() {
        this.ipcService.on(ExperimentsEvents.GetAllListeners, this.getAllEvent);
        this.ipcService.on(ExperimentsEvents.UpdatedListeners, this.updateEvent);
        this.ipcService.on(ExperimentsEvents.CreateListeners, this.createEvent);
        this.ipcService.on(ExperimentsEvents.LoadExperimentListener, this.loadEvent);
    }

    private getAllEvent = (event, experimentList: ExperimentList): void => {
        this.zone.run(() => {
            this.retrieve = true;
            this.experimentsList = experimentList;
            this.experimentsChanged.next(experimentList);
        });
    }

    private updateEvent = (event, value: Experiment): void => {
        this.zone.run(() => {
            const findIndex = this.experimentsList.experiments.findIndex((experiment) => {
                return value.id === experiment.id;
            });
            this.experimentsList.experiments[findIndex] = value;
            this.experimentUpdated.next(value);
        });
    }

    private createEvent = (event, experiment: Experiment): void => {
        this.zone.run(() => {
            const find = this.experimentsList.experiments.find((value) => {
                return value.id === experiment.id;
            });
            if (!find) {
                this.experimentsList.experiments.push(experiment);
            }
            this.newExperiment.next(experiment);
        });
    }

    private loadEvent = (event, id: number): void => {
        this.zone.run(() => {
            const find = this.experimentsList.experiments.find((value) => {
                return value.id === id;
            });
            if (find) {
                find.isLoaded = true;
                this.loadExperiment.next(id);
            }
        });
    }


    ngOnDestroy() {
        this.ipcService.removeListener(ExperimentsEvents.GetAllListeners, this.getAllEvent);
        this.ipcService.removeListener(ExperimentsEvents.UpdatedListeners, this.updateEvent);
        this.ipcService.removeListener(ExperimentsEvents.CreateListeners, this.createEvent);
        this.ipcService.removeListener(ExperimentsEvents.LoadExperimentListener, this.loadEvent);
    }


    load(id: number) {
        this.ipcService.send(ExperimentsEvents.LoadExperimentEvent, id);
    }

    save(id: number) {
        this.ipcService.send(ExperimentsEvents.SaveExperimentEvent, id);
    }


    all(): ExperimentList {
        if (!this.retrieve) {
            this.ipcService.send(ExperimentsEvents.GetAllEvent);
        }
        return this.experimentsList;
    }

    create(): void {
        this.ipcService.send(ExperimentsEvents.CreateEvent);
    }


    get(id: number) {
        const find = this.experimentsList.experiments.find((value: Experiment) => {
            return value.id === id;
        });

        if (find == null) {
            throw new Error('Couldn\'t find experiment.');
        }
        return find;
    }
}
