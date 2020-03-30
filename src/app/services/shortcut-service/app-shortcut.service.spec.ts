import { AppShortcutService } from './app-shortcut.service';
import { Messenger } from '../messenger';
import { Listener } from '../../../../shared/services';
import { MockZone } from '../mock-zone';
import { ShortcutEvents } from '../../../../shared/events';

describe('Angular App Shortcut Service', () => {
    let service: AppShortcutService;
    let messenger: Messenger;
    const dict: {[event: string]: Listener} = {};

    beforeEach(() => {
        messenger = jasmine.createSpyObj('Messenger', ['publish', 'subscribe', 'unsubscribe']);
        (messenger.subscribe as jasmine.Spy).and.callFake((event, listener) => {
            dict[event] = listener;
        });

        service = new AppShortcutService(messenger, new MockZone({}));
    });

    it('should call publish', () => {
        expect(messenger.publish).toHaveBeenCalled();
        expect(messenger.publish).toHaveBeenCalledWith(ShortcutEvents.All);
    });

    it('should call change subject when all called', (done) => {
        service.shortcutChanged.subscribe(() => {
            expect(service.all()).toEqual([
                {
                    key: 'my.shortcut',
                    label: 'My Shortcut',
                    value: 'ctrl + keya',
                    default: 'ctrl + keya'
                }
            ]);
            done();
        });
        dict[ShortcutEvents.All](ShortcutEvents.All, [
            {
                key: 'my.shortcut',
                label: 'My Shortcut',
                value: 'ctrl + keya',
                default: 'ctrl + keya'
            }
        ]);
    });

    it('subscribe should called action when run', () => {
        dict[ShortcutEvents.All](ShortcutEvents.All, [
            {
                key: 'my.shortcut',
                label: 'My Shortcut',
                value: 'ctrl + keya',
                default: 'ctrl + keya'
            }
        ]);
        const spy = jasmine.createSpy('func');
        service.subscribe('my.shortcut', spy);
        service.run('ctrl + keya');
        expect(spy).toHaveBeenCalledTimes(1);
    });
    
    it('turn on watcher should not call action', () => {
        dict[ShortcutEvents.All](ShortcutEvents.All, [
            {
                key: 'my.shortcut',
                label: 'My Shortcut',
                value: 'ctrl + keya',
                default: 'ctrl + keya'
            }
        ]);
        const spy = jasmine.createSpy('func');
        service.subscribe('my.shortcut', spy);
        service.turnOnWatcher();
        service.run('ctrl + keya');
        expect(spy).toHaveBeenCalledTimes(0);
    });
    
    it('turn on and off watcher should call action', () => {
        dict[ShortcutEvents.All](ShortcutEvents.All, [
            {
                key: 'my.shortcut',
                label: 'My Shortcut',
                value: 'ctrl + keya',
                default: 'ctrl + keya'
            }
        ]);
        const spy = jasmine.createSpy('func');
        service.subscribe('my.shortcut', spy);
        service.turnOnWatcher();
        service.turnOffWatcher();
        service.run('ctrl + keya');
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('turn on watcher should call watcher subject', (done) => {
        service.shortcutWatcher.subscribe((value) => {
            expect(value).toBe('ctrl + keya');
            done();
        });

        service.turnOnWatcher();
        service.run('ctrl + keya');
    })

    it('update should call publish', () => {
        service.update({
            key: 'key',
            default: 'default',
            label: 'label',
            value: 'value'
        });
        expect(messenger.publish).toHaveBeenCalledTimes(2);
        expect(messenger.publish).toHaveBeenCalledWith(ShortcutEvents.Update, {
            key: 'key',
            default: 'default',
            label: 'label',
            value: 'value'
        });
    });

    it('subscribe twice should call twice when run', () => {
        dict[ShortcutEvents.All](ShortcutEvents.All, [
            {
                key: 'my.shortcut',
                label: 'My Shortcut',
                value: 'ctrl + keya',
                default: 'ctrl + keya'
            }
        ]);
        const spy = jasmine.createSpy('func');
        service.subscribe('my.shortcut', spy);
        service.subscribe('my.shortcut', spy);
        service.run('ctrl + keya');
        expect(spy).toHaveBeenCalledTimes(2);
    });

    it('unsubscribe should not have been called when run', () => {
        dict[ShortcutEvents.All](ShortcutEvents.All, [
            {
                key: 'my.shortcut',
                label: 'My Shortcut',
                value: 'ctrl + keya',
                default: 'ctrl + keya'
            }
        ]);
        const spy = jasmine.createSpy('func');
        service.subscribe('my.shortcut', spy);
        service.unsubscribe('my.shortcut', spy);
        service.run('ctrl + keya');
        expect(spy).toHaveBeenCalledTimes(0);
    });

    it('unsubscribe should keep other functions', () => {
        dict[ShortcutEvents.All](ShortcutEvents.All, [
            {
                key: 'my.shortcut',
                label: 'My Shortcut',
                value: 'ctrl + keya',
                default: 'ctrl + keya'
            }
        ]);
        const spy = jasmine.createSpy('func');
        const spy2 = jasmine.createSpy('func2');
        service.subscribe('my.shortcut', spy);
        service.subscribe('my.shortcut', spy2);
        service.unsubscribe('my.shortcut', spy);
        service.run('ctrl + keya');
        expect(spy).toHaveBeenCalledTimes(0);
        expect(spy2).toHaveBeenCalledTimes(1);
    });

});

