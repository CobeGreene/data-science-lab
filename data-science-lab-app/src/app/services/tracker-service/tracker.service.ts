import { AlgorithmTracker } from '../../../../shared/models';
import { Subject } from 'rxjs';
import { Service } from '../service';
import { Messenger } from '../messenger';
import { NgZone } from '@angular/core';

export abstract class TrackerService extends Service {

    public trackersChanged: Subject<AlgorithmTracker[]>;
    public trackerUpdated: Subject<AlgorithmTracker>;
    public trackerDeleted: Subject<number>;
    public trackerCreated: Subject<AlgorithmTracker>;

    constructor(messenger: Messenger, zone: NgZone) {
        super(messenger, zone);

        this.trackersChanged = new Subject<AlgorithmTracker[]>();
        this.trackerUpdated = new Subject<AlgorithmTracker>();
        this.trackerCreated = new Subject<AlgorithmTracker>();
        this.trackerDeleted = new Subject<number>();
    }

    destorySubjects() {
        this.trackersChanged.complete();
        this.trackerUpdated.complete();
        this.trackerCreated.complete();
        this.trackerDeleted.complete();
    }

    abstract all(): AlgorithmTracker[];
    abstract get(algorithmId: number): AlgorithmTracker;
    abstract has(algorithmId: number): boolean;
} 



