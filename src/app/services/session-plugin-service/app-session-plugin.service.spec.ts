import { AppSessionPluginService } from './app-session-plugin.service';
import { Messenger } from '../messenger';
import { Listener } from '../../../../shared/services';
import { MockZone } from '../mock-zone';
import { PackageEvents } from '../../../../shared/events';
import { SessionState } from '../../../../shared/models';
import { PluginTypes } from 'data-science-lab-core';


describe('Angular App Session Plugin Service', () => {
    let service: AppSessionPluginService;
    let messenger: Messenger;
    let dict: { [event: string]: Listener } = {};

    beforeEach(() => {
        dict = {};
        messenger = jasmine.createSpyObj('Messenger', ['publish', 'subscribe', 'unsubscribe']);
        (messenger.subscribe as jasmine.Spy).and.callFake((event, listener) => {
            dict[event] = listener;
        });

        service = new AppSessionPluginService(messenger, new MockZone({}));
    });

    afterEach(() => {
        service.ngOnDestroy();
    });

    it('should call publish', () => {
        expect(messenger.publish).toHaveBeenCalled();
    });

    it('should call change subject when all called', (done) => {
        service.pluginsChanged.subscribe((value) => {
            expect(value.length).toBe(1);
            done();
        });
        dict[PackageEvents.SessionAll](PackageEvents.SessionAll, [
            { name: 'Name' }
        ]);
    });

    it('all should return empty list', () => {
        expect(service.all().length).toBe(0);
    });

    it('all should return with type', () => {
        dict[PackageEvents.SessionAll](PackageEvents.SessionAll, [
            { name: 'Name 1', type: PluginTypes.Algorithm },
            { name: 'Name 2', type: PluginTypes.Transform },
            { name: 'Name 3', type: PluginTypes.Transform },
        ]);
        expect(service.all(PluginTypes.Transform).length).toBe(2);
    });

    it('get should throw for not found', () => {
        expect(() => {
            service.get('Name');
        }).toThrowError();
    });

    it('get should throw for not found even with plugins', () => {
        dict[PackageEvents.SessionAll](PackageEvents.SessionAll, [
            { name: 'Name 1' },
            { name: 'Name 2' },
            { name: 'Name 3' },
        ]);
        expect(() => {
            service.get('Name');
        }).toThrowError();
    });

    it('get should return package that match name', () => {
        dict[PackageEvents.SessionAll](PackageEvents.SessionAll, [
            { name: 'Name 1', className: 'Owner' },
            { name: 'Name 2' },
            { name: 'Name 3' },
        ]);
        expect(service.get('Name 1').className).toBe('Owner');
    });

    it('should call publish', (done) => {
        (messenger.publish as jasmine.Spy).and.callFake((event) => {
            expect(event).toBe(PackageEvents.SessionAll);
            done();
        });
        dict[PackageEvents.SessionChange](PackageEvents.SessionChange);
    });

    afterEach(() => {
        service.unregisterEvents();
    });

    it('compitable should return one plugin that matches', () => {
        dict[PackageEvents.SessionAll](PackageEvents.SessionAll, [
            { name: 'Name 1', type: PluginTypes.Algorithm },
            {
                name: 'Name 2', type: PluginTypes.Transform, inputs: [
                    {
                        type: 'number',
                        min: 2
                    }
                ]
            },
            {
                name: 'Name 3', type: PluginTypes.Transform, inputs: [
                    {
                        type: 'number',
                        min: 1
                    },
                    {
                        type: 'string',
                        min: 1
                    },
                ]
            },
        ]);
        expect(service.compatible(PluginTypes.Transform, [
            {
                name: 'name',
                type: 'number'
            },
            {
                name: 'name 2',
                type: 'number'
            },
        ]).length).toBe(1);
    });

});

