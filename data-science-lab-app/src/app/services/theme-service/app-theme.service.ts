import { ThemeService } from './theme.service';
import { Messenger } from '../messenger';
import { NgZone, Injectable } from '@angular/core';
import { ThemeEvents } from '../../../../shared/events';

@Injectable()
export class AppThemeService extends ThemeService {

    theme: {};

    constructor(messeger: Messenger, zone: NgZone) {
        super(messeger, zone);

        this.registerEvents();
        this.messenger.publish(ThemeEvents.Current);
    }

    registerEvents() {
        this.messenger.subscribe(ThemeEvents.Current, this.currentEvent);
        this.messenger.subscribe(ThemeEvents.Change, this.changeEvent);
    }

    unregisterEvents() {
        this.messenger.unsubscribe(ThemeEvents.Current, this.currentEvent);
        this.messenger.unsubscribe(ThemeEvents.Change, this.changeEvent);
    }

    private changeEvent = (_event) => {
        this.messenger.publish(ThemeEvents.Current);
    }

    private currentEvent = (_event, theme: {}) => {
        this.zone.run(() => {
            this.theme = theme;
            Object
                .keys(this.theme)
                .forEach(color =>
                document.documentElement.style.setProperty(`--${color}`, theme[color])
            );

            this.themeChanged.next();
        });
    }

    getColor(color: string): string {
        return this.theme[color];
    }
}

