import { AppDatasetService } from './app-dataset.service';
import { Messenger } from '../messenger';
import { Listener } from '../../../../shared/services';
import { MockZone } from '../mock-zone';
import { DatasetEvents } from '../../../../shared/events';


describe('Angular App Dataset Service', () => {
    let service: AppDatasetService;
    let messenger: Messenger;
    const dict: { [event: string]: Listener } = {};

    beforeEach(() => {
        messenger = jasmine.createSpyObj('Messenger', ['publish', 'subscribe', 'unsubscribe']);
        (messenger.subscribe as jasmine.Spy).and.callFake((event, listener) => {
            dict[event] = listener;
        });

        service = new AppDatasetService(messenger, new MockZone({}));
    });

    afterEach(() => {
        service.ngOnDestroy();
    });

    it('should call publish', () => {
        expect(messenger.publish).toHaveBeenCalled();
    });

    it('should call change subject when all called', (done) => {
        service.datasetsChanged.subscribe((value) => {
            expect(value.length).toBe(1);
            done();
        });
        dict[DatasetEvents.All](DatasetEvents.All, [
            { id: 1 }
        ]);
    });

    it('all should return 2 for 2 datasets', () => {
        dict[DatasetEvents.All](DatasetEvents.All, [
            { id: 1 },
            { id: 2 },
        ]);
        expect(service.all().length).toBe(2);
    });

    it('all should return 1 for 1 datasets in experiment 1', () => {
        dict[DatasetEvents.All](DatasetEvents.All, [
            { id: 1, experimentId: 1 },
            { id: 2, experimentId: 2 },
        ]);
        expect(service.all(1).length).toBe(1);
    });

    it('create should call change subject', (done) => {
        service.datasetsChanged.subscribe((value) => {
            expect(value.length).toBe(1);
            done();
        });
        dict[DatasetEvents.Create](DatasetEvents.Create, 
            { id: 1 }    
        );
    });
    
    it('create should call create subject', (done) => {
        service.datasetCreated.subscribe((value) => {
            expect(value.id).toBe(1);
            done();
        });
        dict[DatasetEvents.Create](DatasetEvents.Create, 
            { id: 1 }    
        );
    });

    it('create twice should call only once', () => {
        const myFunc = jasmine.createSpy("myFunc");
        service.datasetsChanged.subscribe(myFunc);
        dict[DatasetEvents.Create](DatasetEvents.Create,
            { id: 1 }
        );
        dict[DatasetEvents.Create](DatasetEvents.Create,
            { id: 1 }
        );
        expect(myFunc).toHaveBeenCalledTimes(1);
    });

    it('delete event should call delete once subject', () => {
        const myFunc = jasmine.createSpy("myFunc");
        dict[DatasetEvents.Create](DatasetEvents.Create,
            { id: 1 }
        );
        service.datasetDeleted.subscribe(myFunc);
        dict[DatasetEvents.Delete](DatasetEvents.Delete,
            1
        );
        dict[DatasetEvents.Delete](DatasetEvents.Delete,
            1
        );
        expect(myFunc).toHaveBeenCalledTimes(1);
    });


    it('delete event should call delete subject', (done) => {
        dict[DatasetEvents.Create](DatasetEvents.Create, 
            { id: 1 }    
        );
        service.datasetDeleted.subscribe((value) => {
            expect(value).toBe(1);
            done();
        });
        dict[DatasetEvents.Delete](DatasetEvents.Delete, 
            1    
        );
    });

    it('update event should call dataset changed when not found', (done) => {
        service.datasetsChanged.subscribe((value) => {
            expect(value.length).toBe(1);
            done();
        });
        dict[DatasetEvents.Update](DatasetEvents.Update,
            { id: 1 }
        );
    });
    
    it('update event should call dataset update when found', (done) => {
        dict[DatasetEvents.Create](DatasetEvents.Create,
            { id: 1 }
        );
        service.datasetUpdated.subscribe((value) => {
            expect(value.id).toBe(1);
            expect(value.name).toBe('new name');
            done();
        });
        dict[DatasetEvents.Update](DatasetEvents.Update,
            { id: 1, name: 'new name' }
        );
    });


    
    it('delete event should call change subject', (done) => {
        dict[DatasetEvents.Create](DatasetEvents.Create, 
            { id: 1 }    
        );
        service.datasetsChanged.subscribe((value) => {
            expect(value.length).toBe(0);
            done();
        });
        dict[DatasetEvents.Delete](DatasetEvents.Delete, 
            1    
        );
    });

    it('get should throw error for not found', () => {
        expect(() => {
            service.get(404);
        }).toThrow();
    });

    it('exists should return false for not found', () => {
        expect(service.exists(404)).toBeFalsy();
    });
    
    it('exists should return true for posted dataset', () => {
        dict[DatasetEvents.Create](DatasetEvents.Create, 
            { id: 1 }    
        );
        expect(service.exists(1)).toBeTruthy();
    });

    it('get should return dataset', () => {
        dict[DatasetEvents.Create](DatasetEvents.Create, 
            { id: 1, experimentId: 1 }    
        );
        const dataset = service.get(1);
        expect(dataset.experimentId).toBe(1);
    });
    it('delete should call messegner', (done) => {
        (messenger.publish as jasmine.Spy).and.callFake((event, id) => {
            expect(event).toBe(DatasetEvents.Delete);
            expect(id).toBe(1);
            done();
        });
        service.delete(1);
    });
    
    it('rename should call messegner', (done) => {
        (messenger.publish as jasmine.Spy).and.callFake((event, id, name) => {
            expect(event).toBe(DatasetEvents.Rename);
            expect(id).toBe(1);
            expect(name).toBe('name');
            done();
        });
        service.rename(1, 'name');
    });
    
    it('split should call messegner', (done) => {
        (messenger.publish as jasmine.Spy).and.callFake((event, id, split) => {
            expect(event).toBe(DatasetEvents.Split);
            expect(id).toBe(1);
            expect(split).toBe(50);
            done();
        });
        service.split(1, 50);
    });
    
    it('join should call messegner', (done) => {
        (messenger.publish as jasmine.Spy).and.callFake((event, ids) => {
            expect(event).toBe(DatasetEvents.Join);
            expect(ids.length).toBe(0);
            done();
        });
        service.join([]);
    });
    
    it('show should call messegner', (done) => {
        (messenger.publish as jasmine.Spy).and.callFake((event, id) => {
            expect(event).toBe(DatasetEvents.Show);
            expect(id).toBe(1);
            done();
        });
        service.show(1);
    });
    
    it('rename feature should call messegner', (done) => {
        (messenger.publish as jasmine.Spy).and.callFake((event, id, index, name) => {
            expect(event).toBe(DatasetEvents.RenameFeature);
            expect(id).toBe(1);
            expect(index).toBe(2);
            expect(name).toBe('name');
            done();
        });
        service.renameFeature(1, 2, 'name');
    });

});


