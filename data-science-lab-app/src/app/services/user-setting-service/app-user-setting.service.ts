import { Messenger } from '../messenger';
import { NgZone, Injectable } from '@angular/core';
import { SettingEvents } from '../../../../shared/events';
import { UserSettingService } from './user-setting.service';
import { Setting } from '../../../../shared/models';


@Injectable()
export class AppUserSettingService extends UserSettingService {

    private settings: Setting[];

    constructor(messenger: Messenger, zone: NgZone) {
        super(messenger, zone);
        this.settings = [];

        this.registerEvents();
        this.messenger.publish(SettingEvents.All);
    }

    registerEvents() {
        this.messenger.subscribe(SettingEvents.All, this.allEvent);
        this.messenger.subscribe(SettingEvents.Update, this.updateEvent);
    }

    unregisterEvents() {
        this.messenger.unsubscribe(SettingEvents.All, this.allEvent);
        this.messenger.unsubscribe(SettingEvents.Update, this.updateEvent);
    }


    private allEvent = (_event, settings: Setting[]) => {
        this.zone.run(() => {
            this.settings = settings;
            this.settingsChanged.next();
        });
    }

    private updateEvent = (_event, setting: Setting) => {
        this.zone.run(() => {
            const find = this.settings.findIndex(value => value.key === setting.key);
            if (find >= 0) {
                this.settings.splice(find, 1, setting);
            } else {
                this.settings.push(setting);
            }
            this.settingsChanged.next();
        });
    }

    all() {
        return this.settings;
    }

    update(setting: Setting) {
        this.messenger.publish(SettingEvents.Update, setting);
    }

    findOrDefault(key: string) {
        return this.settings.find(value => value.key === key);
    }

}
