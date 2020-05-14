import { Subject } from 'rxjs';
import { Algorithm } from '../../../../shared/models';
import { Service } from '../service';
import { NgZone } from '@angular/core';
import { Messenger } from '../messenger';

export abstract class AlgorithmService extends Service {
    algorithmsChanged: Subject<Algorithm[]>;
    algorithmUpdated: Subject<Algorithm>;
    algorithmCreated: Subject<Algorithm>;
    algorithmDeleted: Subject<number>;

    constructor(messenger: Messenger, zone: NgZone) {
        super(messenger, zone);

        this.algorithmsChanged = new Subject<Algorithm[]>();
        this.algorithmUpdated = new Subject<Algorithm>();
        this.algorithmCreated = new Subject<Algorithm>();
        this.algorithmDeleted = new Subject<number>();
    }

    destorySubjects() {
        this.algorithmsChanged.complete();
        this.algorithmUpdated.complete();
        this.algorithmCreated.complete();
        this.algorithmDeleted.complete();
    }

    abstract all(): Algorithm[];
    // tslint:disable-next-line: unified-signatures
    abstract all(experimentId: number): Algorithm[];
    abstract get(id: number): Algorithm;
    abstract delete(id: number): void;
    abstract update(id: number, name: string, time: number): void;
    abstract start(id: number): void;
    abstract stop(id: number): void;
    abstract export(id: number, language: string): void;
}

