import { AppExperimentService } from './app-experiment.service';
import { Messenger } from '../messenger';
import { Listener } from '../../../../shared/services';
import { MockZone } from '../mock-zone';
import { ExperimentEvents } from '../../../../shared/events';


describe('Angular App Experiment Service', () => {
    let service: AppExperimentService;
    let messenger: Messenger;
    const dict: { [event: string]: Listener } = {};

    beforeEach(() => {
        messenger = jasmine.createSpyObj('Messenger', ['publish', 'subscribe', 'unsubscribe']);
        (messenger.subscribe as jasmine.Spy).and.callFake((event, listener) => {
            dict[event] = listener;
        });

        service = new AppExperimentService(messenger, new MockZone({}));
    });

    it('should call publish', () => {
        expect(messenger.publish).toHaveBeenCalled();
    });

    it('should call change subject when all called', (done) => {
        service.experimentsChanged.subscribe((value) => {
            expect(value.length).toBe(1);
            done();
        });
        dict[ExperimentEvents.All](ExperimentEvents.All, [
            { id: 1 }
        ]);
    });

    it('should call create subject when create', (done) => {
        service.experimentCreated.subscribe((value) => {
            expect(value.id).toBe(1);
            done();
        });
        dict[ExperimentEvents.Create](ExperimentEvents.Create, { id: 1 });
    });

    it('should call change subject when create', (done) => {
        service.experimentsChanged.subscribe((value) => {
            expect(value.length).toBe(1);
            done();
        });
        dict[ExperimentEvents.Create](ExperimentEvents.Create, { id: 1 });
    });

    it('should call delete subject when delete', (done) => {
        service.experimentDeleted.subscribe((value) => {
            expect(value).toBe(1);
            done();
        });
        dict[ExperimentEvents.Create](ExperimentEvents.Create, { id: 1 });
        dict[ExperimentEvents.Delete](ExperimentEvents.Delete, 1);
    });

    it('should call change subject when delete', (done) => {
        dict[ExperimentEvents.Create](ExperimentEvents.Create, { id: 1 });
        service.experimentsChanged.subscribe((value) => {
            expect(value.length).toBe(0);
            done();
        });
        dict[ExperimentEvents.Delete](ExperimentEvents.Delete, 1);
    });
    
    it('should call change subject when update without existing', (done) => {
        service.experimentsChanged.subscribe((value) => {
            expect(value.length).toBe(1);
            done();
        });
        dict[ExperimentEvents.Update](ExperimentEvents.Update, { id: 1 });
    });
    
    it('should call update subject when update', (done) => {
        dict[ExperimentEvents.Create](ExperimentEvents.Create, { id: 1, title: 'Title' });
        service.experimentUpdated.subscribe((value) => {
            expect(value.title).toBe('New Title');
            done();
        });

        dict[ExperimentEvents.Update](ExperimentEvents.Update, { id: 1, title: 'New Title' });
    });

    it('should be empty when all', () => {
        expect(service.all().length).toBe(0);
    });
    
    it('should have one when all', () => {
        dict[ExperimentEvents.Create](ExperimentEvents.Create, { id: 1 });
        expect(service.all().length).toBe(1);
    });

    it('should get id 1 when get', () => {
        dict[ExperimentEvents.Create](ExperimentEvents.Create, { id: 1 });
        expect(service.get(1).id).toBe(1);
    });

    it('should throw to get id 2', () => {
        expect(() => {
            service.get(2);
        }).toThrowError();
    });

    it('should call publish when updating', (done) => {
        (messenger.publish as jasmine.Spy).and.callFake((event, id, title, desc) => {
            expect(event).toBe(ExperimentEvents.Update);
            expect(id).toBe(1);
            expect(title).toBe('Title');
            expect(desc).toBe('Desc');
            done();
        });
        service.update(1, 'Title', 'Desc');
    });

    it('should call publish when deleting', (done) => {
        (messenger.publish as jasmine.Spy).and.callFake((event, id) => {
            expect(event).toBe(ExperimentEvents.Delete);
            expect(id).toBe(1);
            done();
        });
        service.delete(1);
    });
    
    it('should call publish when saving', (done) => {
        (messenger.publish as jasmine.Spy).and.callFake((event, id) => {
            expect(event).toBe(ExperimentEvents.Save);
            expect(id).toBe(1);
            done();
        });
        service.save(1);
    });

    afterEach(() => {
        service.unregisterEvents();
    });
});
