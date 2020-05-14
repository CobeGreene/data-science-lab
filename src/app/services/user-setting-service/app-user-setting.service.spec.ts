import { AppUserSettingService } from './app-user-setting.service';
import { Messenger } from '../messenger';
import { Listener } from '../../../../shared/services';
import { MockZone } from '../mock-zone';
import { SettingEvents } from '../../../../shared/events';

describe('Angular App User Setting Service', () => {

    let service: AppUserSettingService;
    let messenger: Messenger;
    const dict: { [event: string]: Listener } = {};

    beforeEach(() => {
        messenger = jasmine.createSpyObj('Messenger', ['publish', 'subscribe', 'unsubscribe']);
        (messenger.subscribe as jasmine.Spy).and.callFake((event, listener) => {
            dict[event] = listener;
        });

        service = new AppUserSettingService(messenger, new MockZone({}));
    });

    afterEach(() => {
        service.ngOnDestroy();
    });

    it('all should return empty', () => {
        expect(service.all().length).toBe(0);
    });

    it('should call publish at start', () => {
        expect(messenger.publish).toHaveBeenCalled();
    });

    it('update should call publish with setting', (done) => {
        (messenger.publish as jasmine.Spy).and.callFake((event, setting) => {
            expect(event).toBe(SettingEvents.Update);
            expect(setting.key).toBe('key');
            done();
        });
        service.update({
            key: 'key',
            default: 1,
            description: '',
            title: 'Key',
            value: 1,
        });
    });

    it('should call change subject when all called', (done) => {
        service.settingsChanged.subscribe(() => {
            expect(service.all().length).toBe(1);
            done();
        });
        dict[SettingEvents.All](SettingEvents.All, [
            { key: 'key' }
        ]);
    });

    it('should find setting after all called.', () => {
        dict[SettingEvents.All](SettingEvents.All, [
            { key: 'key' }
        ]);

        const setting = service.findOrDefault('key');

        expect(setting.key).toBe('key');
    });

    it('should return undefined for unknown setting', () => {
        dict[SettingEvents.All](SettingEvents.All, [
            { key: 'key' }
        ]);

        const setting = service.findOrDefault('unknown');
        expect(setting).toBe(undefined);
    });

    it('update should call change', (done) => {
        service.settingsChanged.subscribe(() => {
            const setting = service.findOrDefault('key');
            expect(setting.key).toBe('key');
            done();
        });

        dict[SettingEvents.Update](SettingEvents.Update,
            { key: 'key' }
        );
    });

    it('update exist should call change', (done) => {
        dict[SettingEvents.All](SettingEvents.All, [
            { key: 'key', description: 'Desc' }
        ]);

        service.settingsChanged.subscribe(() => {
            const setting = service.findOrDefault('key');
            expect(setting.description).toBe('New Desc');
            done();
        });

        dict[SettingEvents.Update](SettingEvents.Update,
            { key: 'key', description: 'New Desc' }
        );
    });

    afterEach(() => {
        service.unregisterEvents();
        service.destorySubjects();
    });


});



