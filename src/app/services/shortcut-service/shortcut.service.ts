import { Service } from '../service';
import { Subject } from 'rxjs';
import { Messenger } from '../messenger';
import { NgZone } from '@angular/core';
import { Shortcut } from '../../../../shared/models';

export abstract class ShortcutService extends Service {

    public shortcutWatcher: Subject<string>;
    public shortcutChanged: Subject<void>;
    
    constructor(messenger: Messenger, zone: NgZone) {
        super(messenger, zone);
        
        this.shortcutWatcher = new Subject<string>();
        this.shortcutChanged = new Subject<void>();
    }

    destorySubjects() {
        this.shortcutWatcher.complete();
        this.shortcutChanged.complete();
    }

    abstract all(): Shortcut[];
    abstract get(key: string): Shortcut;
    abstract subscribe(shortcut: string, action: () => void);
    abstract unsubscribe(shortcut: string, action: () => void);

    abstract run(shortcut: string);
    abstract turnOffWatcher();
    abstract turnOnWatcher();
    abstract update(shortcut: Shortcut);


}