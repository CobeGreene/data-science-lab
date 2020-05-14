import { ServiceContainer, SERVICE_TYPES } from '../../service-container';
import { Producer } from '../../pipeline';
import { PackageServiceModel } from './package.sm';
import { PackageEvents, ErrorEvent } from '../../../../shared/events';
import { PackageDataService } from '../../data-services/package-data-service';
import { Package } from '../../../../shared/models';

describe('Electron Package Service Model', () => {
    let serviceModel: PackageServiceModel;
    let serviceContainer: ServiceContainer;
    let dataService: PackageDataService;
    let producer: Producer;
    
    
    beforeEach(() => {
        serviceContainer = jasmine.createSpyObj('ServiceContainer', ['resolve']);
        (serviceContainer.resolve as jasmine.Spy).and.callFake((type: SERVICE_TYPES) => {
            if (type === SERVICE_TYPES.PackageDataService) {
                return dataService;
            } 
            throw new Error(`Couldn't resolve type ${type}.`);
        });
        producer = jasmine.createSpyObj('Producer', ['send']);
        dataService = jasmine.createSpyObj('PackageDataService', ['all', 'install', 'uninstall']);
        serviceModel = new PackageServiceModel(serviceContainer, producer);
    });

    it('all should call producer and data service', () => {
        (dataService.all as jasmine.Spy).and.returnValue([]);
        
        serviceModel.all();
        expect(producer.send).toHaveBeenCalled();
        expect(dataService.all).toHaveBeenCalled();
    });
    
    it('install should call producer all', (done) => {
        (dataService.all as jasmine.Spy).and.returnValue([]);
        (dataService.install as jasmine.Spy).and
            .returnValue(new Promise((resolve) => resolve()));
        
        (producer.send as jasmine.Spy).and.callFake((event, value) => {
            if (event === PackageEvents.All) {
                expect(event).toBe(PackageEvents.All);
                expect(value.length).toBe(0);
                done();
            }
        });

        serviceModel.install({
            install: false,
            name: 'Name',
            owner: 'Owner',
            plugins: [],
            repositoryName: 'Repo',
            username: 'User'
        });
    });
    
    it('install should call producer install', (done) => {
        (dataService.all as jasmine.Spy).and.returnValue([]);
        (dataService.install as jasmine.Spy).and
            .returnValue(new Promise((resolve) => resolve()));
        
        (producer.send as jasmine.Spy).and.callFake((event, value) => {
            if (event === PackageEvents.Install) {
                expect(event).toBe(PackageEvents.Install);
                done();
            }
        });

        serviceModel.install({
            install: false,
            name: 'Name',
            owner: 'Owner',
            plugins: [],
            repositoryName: 'Repo',
            username: 'User'
        });
    });
    
    it('install should call producer error', (done) => {
        (dataService.all as jasmine.Spy).and.returnValue([]);
        (dataService.install as jasmine.Spy).and
            .returnValue(new Promise((resolve, reject) => reject()));
        
        (producer.send as jasmine.Spy).and.callFake((event, value) => {
            expect(event).toBe(ErrorEvent);
            done();
        });

        serviceModel.install({
            install: false,
            name: 'Name',
            owner: 'Owner',
            plugins: [],
            repositoryName: 'Repo',
            username: 'User'
        });
    });
    
    it('uninstall should call producer all', (done) => {
        (dataService.all as jasmine.Spy).and.returnValue([]);
        (dataService.uninstall as jasmine.Spy).and
            .returnValue(new Promise((resolve) => resolve()));
        
        (producer.send as jasmine.Spy).and.callFake((event, value) => {
            if (event === PackageEvents.All) {
                expect(event).toBe(PackageEvents.All);
                expect(value.length).toBe(0);
                done();
            }
        });

        serviceModel.uninstall({
            install: false,
            name: 'Name',
            owner: 'Owner',
            plugins: [],
            repositoryName: 'Repo',
            username: 'User'
        });
    });
    
    it('uninstall should call producer uninstall', (done) => {
        (dataService.all as jasmine.Spy).and.returnValue([]);
        (dataService.uninstall as jasmine.Spy).and
            .returnValue(new Promise((resolve) => resolve()));
        
        (producer.send as jasmine.Spy).and.callFake((event, value) => {
            if (event === PackageEvents.Uninstall) {
                expect(event).toBe(PackageEvents.Uninstall);
                done();
            }
        });

        serviceModel.uninstall({
            install: false,
            name: 'Name',
            owner: 'Owner',
            plugins: [],
            repositoryName: 'Repo',
            username: 'User'
        });
    });

    
    it('uninstall should call producer error', (done) => {
        (dataService.all as jasmine.Spy).and.returnValue([]);
        (dataService.uninstall as jasmine.Spy).and
            .returnValue(new Promise((resolve, reject) => reject()));
        
        (producer.send as jasmine.Spy).and.callFake((event, value) => {
            expect(event).toBe(ErrorEvent);
            done();
        });

        serviceModel.uninstall({
            install: false,
            name: 'Name',
            owner: 'Owner',
            plugins: [],
            repositoryName: 'Repo',
            username: 'User'
        });
    });
});


