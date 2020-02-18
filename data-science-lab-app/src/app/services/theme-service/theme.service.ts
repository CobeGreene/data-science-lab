import { Subject } from 'rxjs';
import { Service } from '../service';
import { NgZone } from '@angular/core';
import { Messenger } from '../messenger';

export abstract class ThemeService extends Service {
    public themeChanged: Subject<void>;

    constructor(messenger: Messenger, zone: NgZone) {
        super(messenger, zone);
        
        this.themeChanged = new Subject<void>();
    }

    abstract getColor(path: string): string;
}
