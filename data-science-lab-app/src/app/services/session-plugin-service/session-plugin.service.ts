import { Service } from '../service';
import { SessionPlugin, Feature } from '../../../../shared/models';
import { Subject } from 'rxjs';
import { Messenger } from '../messenger';
import { NgZone } from '@angular/core';


export abstract class SessionPluginService extends Service {
    pluginsChanged: Subject<SessionPlugin[]>;

    constructor(messenger: Messenger, zone: NgZone) {
        super(messenger, zone);

        this.pluginsChanged = new Subject<SessionPlugin[]>();
    }

    destorySubjects() {
        this.pluginsChanged.complete();
    }

    abstract all(): SessionPlugin[];
    abstract all(type: string): SessionPlugin[];
    abstract get(name: string): SessionPlugin;
    abstract compatible(type: string, features: Feature[]): SessionPlugin[];
}
