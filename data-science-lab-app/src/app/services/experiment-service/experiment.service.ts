import { Subject } from 'rxjs';
import { Experiment } from '../../../../shared/models';
import { Service } from '../service';
import { NgZone } from '@angular/core';
import { Messenger } from '../messenger';


export abstract class ExperimentService extends Service {
    experimentsChanged: Subject<Experiment[]>;
    experimentUpdated: Subject<Experiment>;
    experimentCreated: Subject<Experiment>;
    experimentDeleted: Subject<number>;

    constructor(messenger: Messenger, zone: NgZone) {
        super(messenger, zone);

        this.experimentsChanged = new Subject<Experiment[]>();
        this.experimentUpdated = new Subject<Experiment>();
        this.experimentCreated = new Subject<Experiment>();
        this.experimentDeleted = new Subject<number>();
    }

    destorySubjects() {
        this.experimentsChanged.complete();
        this.experimentUpdated.complete();
        this.experimentCreated.complete();
        this.experimentDeleted.complete();
    }

    abstract all(): Experiment[];
    abstract create(title: string, description?: string): void;
    abstract get(id: number): Experiment;
    abstract update(id: number, title: string, description?: string): void;
    abstract delete(id: number): void;
    abstract save(id: number): void;
}

