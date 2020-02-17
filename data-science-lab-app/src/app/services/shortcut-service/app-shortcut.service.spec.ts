import { AppShortcutService } from './app-shortcut.service';

describe('App Shotcut Service', () => {

    let service: AppShortcutService;

    beforeEach(() => {
        service = new AppShortcutService();
    });

    it('subscribe should called action when run', () => {
        const spy = jasmine.createSpy('func');
        service.subscribe('shortcut', spy);
        service.runAction('shortcut');
        expect(spy).toHaveBeenCalled();
    });
    
    it('subscribe twice should call twice when run', () => {
        const spy = jasmine.createSpy('func');
        service.subscribe('shortcut', spy);
        service.subscribe('shortcut', spy);
        service.runAction('shortcut');
        expect(spy).toHaveBeenCalledTimes(2);
    });

    it('unsubscribe should not have been called when run', () => {
        const spy = jasmine.createSpy('func');
        service.subscribe('shortcut', spy);
        service.unsubscribe('shortcut', spy);
        service.runAction('shortcut');
        expect(spy).toHaveBeenCalledTimes(0);
    });

    it('unsubscribe should keep other functions', () => {
        const spy = jasmine.createSpy('func');
        const spy2 = jasmine.createSpy('func2');
        service.subscribe('shortcut', spy);
        service.subscribe('shortcut', spy2);
        service.unsubscribe('shortcut', spy);
        service.runAction('shortcut');
        expect(spy).toHaveBeenCalledTimes(0);
        expect(spy2).toHaveBeenCalledTimes(1);
    });
});

