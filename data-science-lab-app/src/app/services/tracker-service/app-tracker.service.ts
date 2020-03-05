import { NgZone, Injectable } from '@angular/core';
import { TrackerService } from './tracker.service';
import { AlgorithmTracker } from '../../../../shared/models';
import { Messenger } from '../messenger';
import { TrackerEvents } from '../../../../shared/events';


@Injectable()
export class AppTrackerService extends TrackerService {
    private trackers: AlgorithmTracker[];

    constructor(messenger: Messenger, zone: NgZone) {
        super(messenger, zone);

        this.trackers = [];
        this.registerEvents();
        this.messenger.publish(TrackerEvents.All);
    }

    registerEvents() {
        this.messenger.subscribe(TrackerEvents.All, this.allEvent);
        this.messenger.subscribe(TrackerEvents.Create, this.createEvent);
        this.messenger.subscribe(TrackerEvents.Delete, this.deleteEvent);
        this.messenger.subscribe(TrackerEvents.Update, this.updateEvent);
    }

    unregisterEvents() {
        this.messenger.unsubscribe(TrackerEvents.All, this.allEvent);
        this.messenger.unsubscribe(TrackerEvents.Create, this.createEvent);
        this.messenger.unsubscribe(TrackerEvents.Delete, this.deleteEvent);
        this.messenger.unsubscribe(TrackerEvents.Update, this.updateEvent);
    }

    private allEvent = (_event, trackers: AlgorithmTracker[]) => {
        this.zone.run(() => {
            this.trackers = trackers;
            this.trackersChanged.next(this.trackers);
        });
    }

    private createEvent = (_event, tracker: AlgorithmTracker) => {
        this.zone.run(() => {
            const find = this.trackers.find(value => value.algorithmId === tracker.algorithmId);
            if (find === undefined) {
                this.trackers.push(tracker);
                this.trackerCreated.next(tracker);
                this.trackersChanged.next(this.trackers);
            }
        });
    }

    private deleteEvent = (_event, id: number) => {
        this.zone.run(() => {
            const find = this.trackers.findIndex(value => value.algorithmId === id);
            if (find >= 0) {
                this.trackers.splice(find, 1);
                this.trackerDeleted.next(id);
                this.trackersChanged.next(this.trackers);
            }
        });
    }

    private updateEvent = (_event, tracker: AlgorithmTracker) => {
        this.zone.run(() => {
            const find = this.trackers.findIndex(value => value.algorithmId === tracker.algorithmId);
            if (find >= 0) {
                this.trackers.splice(find, 1, tracker);
                this.trackerUpdated.next(tracker);
            } else {
                this.trackers.push(tracker);
                this.trackersChanged.next(this.trackers);
            }
        });
    }

    all(): AlgorithmTracker[] {
        return this.trackers;
    }

    get(algorithmId: number) {
        const find = this.trackers.find(value => value.algorithmId === algorithmId);
        if (find === undefined) {
            throw new Error(`Couldn't find tracker with algorithm id ${algorithmId}`);
        }
        return find;
    }

    has(algorithmId: number) {
        return this.trackers.findIndex(value => value.algorithmId === algorithmId) >= 0; 
    }
}


