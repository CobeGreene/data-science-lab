import { ShortcutInput } from '../../models';

export abstract class ShortcutService {

    public shortcuts: ShortcutInput[];

    constructor() {
        this.shortcuts = [];
    }

    abstract subscribe(shortcut: string, action: () => void);

    abstract unsubscribe(shortcut: string, action: () => void);

    abstract runAction(shortcut: string);
}
