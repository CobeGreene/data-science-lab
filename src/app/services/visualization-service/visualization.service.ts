import { Subject } from 'rxjs';
import { Visual } from '../../../../shared/models';
import { Service } from '../service';
import { NgZone } from '@angular/core';
import { Messenger } from '../messenger';

export abstract class VisualizationService extends Service {
    visualsChanged: Subject<Visual[]>;
    visualCreated: Subject<Visual>;
    visualUpdated: Subject<Visual>;
    visualDeleted: Subject<number>;

    constructor(messenger: Messenger, zone: NgZone) {
        super(messenger, zone);

        this.visualsChanged = new Subject<Visual[]>();
        this.visualCreated = new Subject<Visual>();
        this.visualUpdated = new Subject<Visual>();
        this.visualDeleted = new Subject<number>();
    }

    destorySubjects() {
        this.visualsChanged.complete();
        this.visualCreated.complete();
        this.visualUpdated.complete();
        this.visualDeleted.complete();
    }

    abstract all(): Visual[];
    // tslint:disable-next-line: unified-signatures
    abstract all(experimentId: number): Visual[];
    abstract get(id: number): Visual;
    abstract delete(id: number): void;
    abstract resize(id: number, width: number, height: number): void;
    abstract reposition(id: number, top: number, left: number): void;
    abstract show(id: number): void;
}

