import { Injectable, OnDestroy, NgZone } from '@angular/core';
import { ExperimentService } from './experiment.service';
import { IpcService } from '../../../../shared/services';
import { Subject } from 'rxjs';
import { ExperimentList, Experiment, Plugin } from '../../../../shared/models';
import { ExperimentsEvents, ErrorEvents } from '../../../../shared/events';
import { ExperimentAlgorithmPlugins } from '../../models';

@Injectable()
export class AppExperimentService implements ExperimentService, OnDestroy {

    public experimentsChanged: Subject<ExperimentList>;
    public newExperiment: Subject<Experiment>;
    public fetchPlugins: Subject<Plugin[]>;
    public experimentAlgorithmPlugins: Subject<ExperimentAlgorithmPlugins>;

    private retrieve: boolean;
    private experimentsList: ExperimentList;

    constructor(private ipcService: IpcService, private zone: NgZone) {
        this.experimentsChanged = new Subject<ExperimentList>();
        this.newExperiment = new Subject<Experiment>();
        this.experimentsList = new ExperimentList();
        this.fetchPlugins = new Subject<Plugin[]>();
        this.experimentAlgorithmPlugins = new Subject<ExperimentAlgorithmPlugins>();
        this.retrieve = false;
        this.registerGetAll();
        this.registerCreate();
    }
    
    ngOnDestroy() {
        this.unregisterGetAll();
        this.unregisterCreate();
    }


    all(): ExperimentList {
        if (!this.retrieve) {
            this.ipcService.send(ExperimentsEvents.GetAllEvent);
        }
        return this.experimentsList;
    }

    getExperimentAlgorithmPlugins(id: number): ExperimentAlgorithmPlugins {
        throw new Error('Not implemented');
    }

    getFetchPlugins(): Plugin[] {
        throw new Error('Not implemented');
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
                const value = JSON.parse(arg[0]) as ExperimentList;
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

    private registerCreate(): void {
        this.ipcService.on(ExperimentsEvents.CreateListeners, this.createEvent);
    }

    private unregisterCreate(): void {
        this.ipcService.removeListener(ExperimentsEvents.CreateListeners, this.createEvent);
    }

    private createEvent = (event, arg): void => {
        this.zone.run(() => {
            try {
                const experment = JSON.parse(arg[0]) as Experiment;
                const find = this.experimentsList.experiments.find((value: Experiment) => {
                    return experment.id === value.id;
                });
                if (find) {
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
