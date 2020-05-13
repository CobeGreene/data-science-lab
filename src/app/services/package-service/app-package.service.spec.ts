import { AppPackageService } from './app-package.service';
import { Messenger } from '../messenger';
import { Listener } from '../../../../shared/services';
import { MockZone } from '../mock-zone';
import { PackageEvents } from '../../../../shared/events';
import { Package } from '../../../../shared/models';

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

    afterEach(() => {
        service.ngOnDestroy();
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

    it('should call change feature subject when all called', (done) => {
        service.featureChanged.subscribe((value) => {
            expect(value.length).toBe(0);
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

    it('feature packages should return three items', () => {
        dict[PackageEvents.Feature](PackageEvents.All, [
            { name: 'Name 1' },
            { name: 'Name 2' },
            { name: 'Name 3' },
        ]);
        expect(service.featurePackages().length).toBe(3);
    });

    it('feature should call feature change', (done) => {
        service.featureChanged.subscribe((value) => {
            expect(value.length).toBe(3);
            done();
        });
        dict[PackageEvents.Feature](PackageEvents.All, [
            { name: 'Name 1' },
            { name: 'Name 2' },
            { name: 'Name 3' },
        ]);
    });


    it('all should update feature that are not install', () => {
        dict[PackageEvents.Feature](PackageEvents.Feature, [
            { name: 'Name 1', install: true },
            { name: 'Name 2', install: false },
            { name: 'Name 3', install: true },
        ]);
        dict[PackageEvents.All](PackageEvents.Feature, [
            { name: 'Name 2', install: true },
            { name: 'Name 3', install: true },
        ]);
        expect(service.featurePackages()).toEqual([
            { name: 'Name 1', install: false },
            { name: 'Name 2', install: true },
            { name: 'Name 3', install: true },
        ] as Package[]);
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

    it('search should publish when searching', (done) => {
        (messenger.publish as jasmine.Spy).and.callFake((event, search, type, page) => {
            expect(event).toBe(PackageEvents.Search);
            expect(search).toBe('Name');
            expect(type).toBe('Type');
            expect(page).toBe(0);
            done();
        });
        service.search('Name', 'Type', 0);
    });

    it('fetch should call publish for not found', (done) => {
        (messenger.publish as jasmine.Spy).and.callFake((event, name) => {
            expect(event).toBe(PackageEvents.Get);
            expect(name).toBe('Not Found');
            done();
        });
        service.fetch('Not Found');
    });

    it('fetch should call package get for in packages', (done) => {
        dict[PackageEvents.All](PackageEvents.All, [
            { name: 'Name 1', install: true },
            { name: 'Name 2', install: false },
            { name: 'Name 3', install: true },
        ]);
        service.packageGet.subscribe((value) => {
            expect(value.name).toEqual('Name 2');
            expect(value.install).toEqual(false);
            done();
        });
        service.fetch('Name 2');
    });

    it('fetch should call package get for in features', (done) => {
        dict[PackageEvents.Feature](PackageEvents.Feature, [
            { name: 'Name 1', install: true },
            { name: 'Name 2', install: false },
            { name: 'Name 3', install: true },
        ]);
        service.packageGet.subscribe((value) => {
            expect(value.name).toEqual('Name 2');
            expect(value.install).toEqual(false);
            done();
        });
        service.fetch('Name 2');
    });

    it('search should call package get for in features', (done) => {
        service.featureChanged.subscribe((value) => {
            expect(value.length).toEqual(3);
            done();
        });
        dict[PackageEvents.Search](PackageEvents.Search, [
            { name: 'Name 1', install: true },
            { name: 'Name 2', install: false },
            { name: 'Name 3', install: true },
        ]);
        service.search('Name', 'All', 0);
    });

    it('package get event should update package get subject', (done) => {
        service.packageGet.subscribe((value) => {
            expect(value.name).toEqual('Name 2');
            expect(value.install).toEqual(true);
            done();
        });
        dict[PackageEvents.Get](PackageEvents.Get, { name: 'Name 2', install: true });
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

    it('change should call publish', (done) => {
        (messenger.publish as jasmine.Spy).and.callFake((event) => {
            expect(event).toBe(PackageEvents.All);
            done();
        });
        dict[PackageEvents.Change](PackageEvents.Change);
    });

    it('feature should call to publish featrue', () => {
        service.feature();
        expect(messenger.publish).toHaveBeenCalledWith(PackageEvents.Feature);
    });


});


