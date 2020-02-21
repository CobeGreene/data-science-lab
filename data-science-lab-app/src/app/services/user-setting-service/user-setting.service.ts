import { Service } from '../service';
import { NgZone } from '@angular/core';
import { Messenger } from '../messenger';
import { Subject } from 'rxjs';
import { Setting } from '../../../../shared/models';

export abstract class UserSettingService extends Service {

    public settingsChanged: Subject<void>;

    constructor(messenger: Messenger, zone: NgZone) {
        super(messenger, zone);

        this.settingsChanged = new Subject<void>();
    }

    destorySubjects() {
        this.settingsChanged.complete();
    }

    abstract all();

    abstract update(setting: Setting);

    abstract findOrDefault(key: string): Setting | undefined;
}

