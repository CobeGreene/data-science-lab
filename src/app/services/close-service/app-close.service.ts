import { CloseService } from './close.service';
import { Injectable, NgZone } from '@angular/core';
import { Messenger } from '../messenger';
import { AppCloseEvent } from '../../../../shared/events';

@Injectable()
export class AppCloseService extends CloseService {
    constructor(messenger: Messenger, zone: NgZone) {
        super(messenger, zone);
    }
    registerEvents() {

    }
    unregisterEvents() {

    }
    destorySubjects() {

    }


    close() {
        this.messenger.publish(AppCloseEvent);
    }
}