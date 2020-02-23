import { AppPackageService } from './app-package.service';
import { Messenger } from '../messenger';
import { Listener } from '../../../../shared/services';
import { MockZone } from '../mock-zone';
import { PackageEvents } from '../../../../shared/events';

describe('Angular App Package Service', () => {
    let service: AppPackageService;
    let messenger: Messenger;
    const dict: { [event: string]: Listener } = {};

    beforeEach(() => {
        messenger = jasmine.createSpyObj('Messenger', ['publish', 'subscribe', 'unsubscribe']);
        (messenger.subscribe as jasmine.Spy).and.callFake((event, listener) => {
            dict[event] = listener;
        });

        service = new AppPackageService(messenger, new MockZone({}));
    });

    it('should call publish', () => {
        expect(messenger.publish).toHaveBeenCalled();
    });

    it('should call change subject when all called', (done) => {
        service.packagesChanged.subscribe((value) => {
            expect(value.length).toBe(1);
            done();
        });
        dict[PackageEvents.All](PackageEvents.All, [
            { name: 'Name' }
        ]);
    });

    it('all should return empty list', () => {
        expect(service.all().length).toBe(0);
    });
    
    it('all should return three items', () => {
        dict[PackageEvents.All](PackageEvents.All, [
            { name: 'Name 1' },
            { name: 'Name 2' },
            { name: 'Name 3' },
        ]);
        expect(service.all().length).toBe(3);
    });

    it('install should publish when installing', (done) => {
        (messenger.publish as jasmine.Spy).and.callFake((event, pluginPackage) => {
            expect(event).toBe(PackageEvents.Install);
            expect(pluginPackage.name).toBe('Name');
            done();
        });
        service.install({
            name: 'Name',
            install: false,
            owner: 'Owner',
            plugins: [],
            repositoryName: 'Repo',
            username: 'User'
        });
    });

    it('uninstall should publish when uninstalling', (done) => {
        (messenger.publish as jasmine.Spy).and.callFake((event, pluginPackage) => {
            expect(event).toBe(PackageEvents.Uninstall);
            expect(pluginPackage.name).toBe('Name');
            done();
        });
        service.uninstall({
            name: 'Name',
            install: true,
            owner: 'Owner',
            plugins: [],
            repositoryName: 'Repo',
            username: 'User'
        });
    });

    it('get should throw for not found', () => {
        expect(() => {
            service.get('Name');
        }).toThrowError();
    });
    
    it('get should throw for not found even with plugins', () => {
        dict[PackageEvents.All](PackageEvents.All, [
            { name: 'Name 1' },
            { name: 'Name 2' },
            { name: 'Name 3' },
        ]);
        expect(() => {
            service.get('Name');
        }).toThrowError();
    });
    
    it('get should return package that match name', () => {
        dict[PackageEvents.All](PackageEvents.All, [
            { name: 'Name 1', owner: 'Owner' },
            { name: 'Name 2' },
            { name: 'Name 3' },
        ]);
        expect(service.get('Name 1').owner).toBe('Owner');
    });


});


