import { Shortcut } from '../../../../shared/models';

export interface ShortcutDataService {
    all(): Shortcut[];
    find(key: string): Shortcut | undefined;
    update(shortcut: Shortcut): void;
}