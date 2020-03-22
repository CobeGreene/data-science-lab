import { OpenLinkService } from './open-link.service';
import { Injectable, NgZone } from '@angular/core';
import { OpenLinkEvent } from '../../../../shared/events';
import { Messenger } from '../messenger';

@Injectable()
export class AppOpenLinkService extends OpenLinkService {
    
    constructor(messenger: Messenger, zone: NgZone) {
        super(messenger, zone);
    }

    registerEvents() {
        
    }
    unregisterEvents() {
        
    }
    destorySubjects() {
        
    }
    
    open(href: string) {
        this.messenger.publish(OpenLinkEvent, href);    
    }

}
