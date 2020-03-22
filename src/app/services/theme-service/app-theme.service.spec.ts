import { AppThemeService } from './app-theme.service';
import { MockZone } from '../mock-zone';
import { Messenger } from '../messenger';
import { Listener } from '../../../../shared/services';
import { ThemeEvents } from '../../../../shared/events';


describe('Angular App Theme Service', () => {
    let service: AppThemeService;
    let messenger: Messenger;
    const dict: { [event: string]: Listener } = {};

    beforeEach(() => {
        messenger = jasmine.createSpyObj('Messenger', ['publish', 'subscribe', 'unsubscribe']);
        (messenger.subscribe as jasmine.Spy).and.callFake((event, listener) => {
            dict[event] = listener;
        });

        service = new AppThemeService(messenger, new MockZone({}));
    });

    it('should call publish', () => {
        expect(messenger.publish).toHaveBeenCalled();
    });

    it('should call publish twice when change event happens', () => {
        dict[ThemeEvents.Change](ThemeEvents.Change);
        expect(messenger.publish).toHaveBeenCalledTimes(2);
    });

    it('should notify theme change when current is called', (done) => {
        service.themeChanged.subscribe(() => {
            expect().nothing();
            done();
        });
        dict[ThemeEvents.Current](ThemeEvents.Current, {});
    });

    it('should have updated version of theme when current is given', () => {
        dict[ThemeEvents.Current](ThemeEvents.Current, { color: '#FFF' });
        expect(service.getColor('color')).toEqual('#FFF');
    });

    afterEach(() => {
        service.unregisterEvents();
    });

});
