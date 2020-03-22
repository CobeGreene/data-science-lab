import { ShortcutService } from './shortcut.service';

export class AppShortcutService extends ShortcutService {

    private observers: { [shortcut: string]: Array<() => void> };

    constructor() {
        super();
        this.observers = { };
    }

    subscribe(shortcut: string, action: () => void) {
        if (this.observers[shortcut]) {
            this.observers[shortcut].push(action);
        } else {
            this.observers[shortcut] = new Array<() => void>(action);
            this.shortcuts.push({
                shortcut,
                command: () => this.runAction(shortcut)
            });
        }
    }    
    
    unsubscribe(shortcut: string, action: () => void) {
        if (this.observers[shortcut]) {
            const find = this.observers[shortcut].findIndex((value) => {
                return value === action;
            });
            if (find >= 0) {
                this.observers[shortcut].splice(find, 1);
            } 
        }   
    }

    runAction(shortcut: string) {
        if (this.observers[shortcut]) {
            this.observers[shortcut].forEach((cmd) => {
                cmd();
            });
        }
    }
}
