import { Subject } from 'rxjs';
import { Dataset } from '../../../../shared/models';
import { Service } from '../service';
import { NgZone } from '@angular/core';
import { Messenger } from '../messenger';

export abstract class DatasetService extends Service {
    datasetsChanged: Subject<Dataset[]>;
    datasetUpdated: Subject<Dataset>;
    datasetCreated: Subject<Dataset>;
    datasetDeleted: Subject<number>;

    constructor(messenger: Messenger, zone: NgZone) {
        super(messenger, zone);

        this.datasetsChanged = new Subject<Dataset[]>();
        this.datasetUpdated = new Subject<Dataset>();
        this.datasetCreated = new Subject<Dataset>();
        this.datasetDeleted = new Subject<number>();
    }

    destorySubjects() {
        this.datasetsChanged.complete();
        this.datasetUpdated.complete();
        this.datasetCreated.complete();
        this.datasetDeleted.complete();
    }

    abstract all(): Dataset[];
    // tslint:disable-next-line: unified-signatures
    abstract all(experimentId: number): Dataset[];
    abstract get(id: number): Dataset;
    abstract delete(id: number): void;
    abstract rename(id: number, name: string): void;
    abstract split(id: number, split: number): void;
    abstract join(ids: number[]): void;
}

