import { ShortcutService } from "./shortcut.service";
import { Messenger } from "../messenger";
import { NgZone, Injectable } from "@angular/core";
import { ShortcutEvents } from "../../../../shared/events";
import { Shortcut } from "../../../../shared/models";
import { Shortcuts } from "../../../../shared/shortcuts";

@Injectable()
export class AppShortcutService extends ShortcutService {

    private shortcuts: Shortcut[];
    private observers: { [shortcut: string]: Array<() => void> };
    private isWatchMode: boolean;

    constructor(messenger: Messenger, zone: NgZone) {
        super(messenger, zone);

        this.observers = { };
        this.isWatchMode = false;
        
        this.registerEvents();
        this.messenger.publish(ShortcutEvents.All);
    }

    registerEvents() {
        this.messenger.subscribe(ShortcutEvents.All, this.allEvent);
    }
    
    unregisterEvents() {
        this.messenger.unsubscribe(ShortcutEvents.All, this.allEvent);
    }

    private allEvent = (_event, shortcuts: Shortcut[]) => {
        this.zone.run(() => {
            this.shortcuts = shortcuts;
            this.shortcutChanged.next();
        });
    }

    all(): Shortcut[] {
        return this.shortcuts;
    }

    get(key: string): Shortcut {
        const find = this.shortcuts.find((value) => value.key === key);
        if (find === undefined) {
            throw new Error(`Couldn't find shortcut with name ${name}`);
        }
        return find;
    }

    subscribe(shortcut: string, action: () => void) {
        if (this.observers[shortcut] !== undefined) {
            this.observers[shortcut].push(action);
        } else {
            this.observers[shortcut] = new Array<() => void>(action);
        }
    }

    unsubscribe(shortcut: string, action: () => void) {
        if (this.observers[shortcut] !== undefined) {
            const find = this.observers[shortcut].findIndex((value) => {
                return value === action;
            });
            if (find >= 0) {
                this.observers[shortcut].splice(find, 1);
            } 
        }   
    }

    run(shortcut: string) {
        if (this.isWatchMode) {
            this.shortcutWatcher.next(shortcut);
        } else {
            if (shortcut.startsWith(Shortcuts.Arrow) || shortcut === Shortcuts.Enter || shortcut === Shortcuts.Escape) {
                this.observers[shortcut].forEach(cmd => cmd());
            } else {
                this.shortcuts
                    .filter((userShortcut) => userShortcut.value === shortcut)
                    .forEach((userShortcut) => {
                        if (this.observers[userShortcut.key] !== undefined) {
                            this.observers[userShortcut.key].forEach(cmd => cmd());
                        }
                    });
            }
        }
    }

    turnOffWatcher() {
        this.isWatchMode = false;
    }

    turnOnWatcher() {
        this.isWatchMode = true;
    }

    update(shortcut: Shortcut) {
        this.messenger.publish(ShortcutEvents.Update, shortcut);
    }




}


