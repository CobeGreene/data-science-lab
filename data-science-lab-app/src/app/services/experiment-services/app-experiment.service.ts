import { Injectable, OnDestroy, NgZone } from '@angular/core';
import { ExperimentService } from './experiment.service';
import { IpcService } from '../../../../shared/services';
import { Subject } from 'rxjs';
import { ExperimentList, Experiment } from '../../../../shared/models';
import { ExperimentsEvents, ErrorEvents } from '../../../../shared/events';

@Injectable()
export class AppExperimentService implements ExperimentService, OnDestroy {

    public experimentsChanged: Subject<ExperimentList>;
    public experimentUpdated: Subject<Experiment>;
    public newExperiment: Subject<Experiment>;

    private retrieve: boolean;
    private experimentsList: ExperimentList;

    constructor(private ipcService: IpcService, private zone: NgZone) {
        this.experimentsChanged = new Subject<ExperimentList>();
        this.newExperiment = new Subject<Experiment>();
        this.experimentUpdated = new Subject<Experiment>();
        this.experimentsList = new ExperimentList();
        this.retrieve = false;
        this.registerGetAll();
        this.registerCreate();
        this.registerUpdate();
    }
    
    ngOnDestroy() {
        this.unregisterGetAll();
        this.unregisterCreate();
        this.unregisterUpdate();
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

    get(id: number): Experiment {
        const find = this.experimentsList.experiments.find((value: Experiment) => {
            return value.id === id;
        });

        if (find == null) {
            throw new Error('Couldn\'t find experiment.');
        }
        return find;
    }

    private registerGetAll(): void {
        this.ipcService.on(ExperimentsEvents.GetAllListeners, this.getAllEvent);
    }
    
    private unregisterGetAll(): void {
        this.ipcService.removeListener(ExperimentsEvents.GetAllListeners, this.getAllEvent);
    }

    private getAllEvent = (event, arg): void => {
        this.zone.run(() => {
            try {
                const value = arg[0] as ExperimentList;
                this.experimentsList = value;
                this.retrieve = true;
                this.experimentsChanged.next(this.all());
            } catch (exception) {
                if (exception instanceof Error) {
                    this.ipcService.send(ErrorEvents.ExceptionListeners, exception.message);
                } else {
                    this.ipcService.send(ErrorEvents.ExceptionListeners, exception);
                }
            }
        });
    }

    private registerUpdate(): void {
        this.ipcService.on(ExperimentsEvents.UpdatedListeners, this.updateEvent);
    }
    
    private unregisterUpdate(): void {
        this.ipcService.removeListener(ExperimentsEvents.UpdatedListeners, this.updateEvent);
    }

    private updateEvent = (event, arg): void => {
        this.zone.run(() => {
            try {
                const value = arg[0] as Experiment;
                const findIndex = this.experimentsList.experiments.findIndex((experiment) => {
                    return value.id === experiment.id;
                });
                this.experimentsList.experiments[findIndex] = value;
                this.experimentUpdated.next(value);
            } catch (exception) {
                if (exception instanceof Error) {
                    this.ipcService.send(ErrorEvents.ExceptionListeners, exception.message);
                } else {
                    this.ipcService.send(ErrorEvents.ExceptionListeners, exception);
                }
            }
        });
    }

    private registerCreate(): void {
        this.ipcService.on(ExperimentsEvents.CreateListeners, this.createEvent);
    }

    private unregisterCreate(): void {
        this.ipcService.removeListener(ExperimentsEvents.CreateListeners, this.createEvent);
    }

    private createEvent = (event, arg): void => {
        this.zone.run(() => {
            try {
                const experment = arg[0] as Experiment;
                const find = this.experimentsList.experiments.find((value) => {
                    return value.id === experment.id;
                });
                if (!find) {
                    this.experimentsList.experiments.push(experment);
                }
                this.newExperiment.next(experment);
            } catch (exception) {
                if (exception instanceof Error) {
                    this.ipcService.send(ErrorEvents.ExceptionListeners, exception.message);
                } else {
                    this.ipcService.send(ErrorEvents.ExceptionListeners, exception);
                }
            }
        });
    }
}
