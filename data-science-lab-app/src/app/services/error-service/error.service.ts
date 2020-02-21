import { Subject } from 'rxjs';
import { Service } from '../service';
import { Messenger } from '../messenger';
import { NgZone } from '@angular/core';

export abstract class ErrorService extends Service {
    errorCreated: Subject<any>;

    constructor(messenger: Messenger, zone: NgZone) {
        super(messenger, zone);

        this.errorCreated = new Subject<any>();
    }

    destorySubjects() {
        this.errorCreated.complete();
    }
}
