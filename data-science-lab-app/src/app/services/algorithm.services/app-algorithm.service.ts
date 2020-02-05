import { Injectable, OnDestroy, NgZone } from '@angular/core';
import { AlgorithmService } from './algorithm.service';
import { AlgorithmViewModel } from '../../../../shared/view-models';
import { IpcService } from '../../../../shared/services';
import { ExperimentsEvents } from '../../../../shared/events';

@Injectable()
export class AppAlgorithmService extends AlgorithmService implements OnDestroy {
    
    private algorithms: AlgorithmViewModel[];

    constructor(private ipcService: IpcService, private zone: NgZone) {
        super();
        
        this.algorithms = [];
        this.registerEvents();
        this.ipcService.send(ExperimentsEvents.GetAllAlgorithmsEvent);
    }
    
    registerEvents() {
        this.ipcService.on(ExperimentsEvents.GetAllAlgorithmsListeners, this.getAllEvent);
        this.ipcService.on(ExperimentsEvents.NewAlgorithmListeners, this.newEvent);
        this.ipcService.on(ExperimentsEvents.DeleteAlgorithmListeners, this.deleteEvent);
        this.ipcService.on(ExperimentsEvents.UpdatedAlgorithmListeners, this.updatedEvent);
    }
    
    all(experimentId: number): AlgorithmViewModel[] {
        return this.algorithms.filter((value) => {
            return value.experimentId === experimentId;
        });
    }
    
    get(id: number): AlgorithmViewModel {
        const find = this.algorithms.find((value) => {
            return value.id === id;
        });
        if (find) { 
            return find;
        }
        throw new Error(`Couldn't find algorithms with id ${id}`);
    }

    start(id: number) {
        this.ipcService.send(ExperimentsEvents.StartAlgorithmEvent, id);
    }

    stop(id: number) {
        this.ipcService.send(ExperimentsEvents.StopAlgorithmEvent, id);
    }

    delete(id: number): void {
        this.ipcService.send(ExperimentsEvents.DeleteAlgorithmEvent, id);
    }

    updatedEvent = (event, algorithm: AlgorithmViewModel) => {
        this.zone.run(() => {
            const findIndex = this.algorithms.findIndex((value) => {
                return value.id === algorithm.id;
            });
            if (findIndex >= 0) {
                this.algorithms[findIndex] = algorithm;
            }
            this.updatedAlgorithm.next(algorithm);
        });
    }

    deleteEvent = (event, id: number) => {
        this.zone.run(() => {
            const findIndex = this.algorithms.findIndex((value) => {
                return value.id === id;
            });
            if (findIndex >= 0) {
                this.algorithms.splice(findIndex, 1);
            }
            this.deletedAlgorithm.next(id);
        });
    }

    newEvent = (event, algorithm: AlgorithmViewModel) => {
        this.zone.run(() => {
            this.algorithms.push(algorithm);
            this.newAlgorithm.next(algorithm);
        });
    }

    

    getAllEvent = (event, algorithms: AlgorithmViewModel[]) => {
        this.zone.run(() => {
            this.algorithms = algorithms;
        });
    }

    
    ngOnDestroy() {
        this.ipcService.removeListener(ExperimentsEvents.GetAllAlgorithmsListeners, this.getAllEvent);
        this.ipcService.removeListener(ExperimentsEvents.NewAlgorithmListeners, this.newEvent);
        this.ipcService.removeListener(ExperimentsEvents.DeleteAlgorithmListeners, this.deleteEvent);
        this.ipcService.removeListener(ExperimentsEvents.UpdatedAlgorithmListeners, this.updatedEvent);        
    }
}

