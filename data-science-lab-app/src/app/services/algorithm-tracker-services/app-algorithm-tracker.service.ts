import { Injectable, OnDestroy, OnInit, NgZone } from '@angular/core';
import { AlgorithmTrackerService } from './algorithm-tracker.service';
import { AlgorithmTrackerViewModel } from '../../../../shared/view-models';
import { IpcService } from '../../../../shared/services';
import { ExperimentsEvents } from '../../../../shared/events';


@Injectable()
export class AppAlgorithmTrackerService extends AlgorithmTrackerService implements OnDestroy {
    
    private trackers: AlgorithmTrackerViewModel[];

    constructor(private ipcService: IpcService, private zone: NgZone) {
        super();

        this.trackers = [];

        this.registerEvents();
    }

    registerEvents() {
        this.ipcService.on(ExperimentsEvents.NewAlgorithmTrackerListeners, this.newEvent);
        this.ipcService.on(ExperimentsEvents.UpdatedAlgorithmTrackerListeners, this.updateEvent);
    }


    private updateEvent = (event, tracker: AlgorithmTrackerViewModel) => {
        this.zone.run(() => {
            const findIndex = this.trackers.findIndex((value) => {
                return value.algorithmId === tracker.algorithmId;
            });
            if (findIndex >= 0) {
                this.trackers[findIndex] = tracker;
            } else {
                this.trackers.push(tracker);
            }
            this.updateTracker.next(tracker);
        });   
    }
    
    private newEvent = (event, tracker: AlgorithmTrackerViewModel) => {
        this.zone.run(() => {
            this.trackers.push(tracker);
            this.newTracker.next(tracker);
        });
    }
    
    
    has(id: number): boolean {
        return this.trackers.find((value) => {
            return value.algorithmId === id;
        }) !== undefined;
    }

    get(id: number): AlgorithmTrackerViewModel {
        const find = this.trackers.find((value) => {
            return value.algorithmId === id;
        });
        if (find) { 
            return find;
        }
        throw new Error(`Couldn't find tracker with algorithm id ${id}`);
    }
    
    
    
    ngOnDestroy(): void {
        this.ipcService.removeListener(ExperimentsEvents.NewAlgorithmTrackerListeners, this.newEvent);
        this.ipcService.removeListener(ExperimentsEvents.UpdatedAlgorithmTrackerListeners, this.updateEvent);
    }

} 

