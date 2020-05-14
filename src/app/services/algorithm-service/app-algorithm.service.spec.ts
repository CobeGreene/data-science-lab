import { AppAlgorithmService } from './app-algorithm.service';
import { Messenger } from '../messenger';
import { Listener } from '../../../../shared/services';
import { MockZone } from '../mock-zone';
import { AlgorithmEvents } from '../../../../shared/events';


describe('Angular App Algorithm Service', () => {
    let service: AppAlgorithmService;
    let messenger: Messenger;
    let dict: { [event: string]: Listener } = {};

    beforeEach(() => {
        dict = {};
        messenger = jasmine.createSpyObj('Messenger', ['publish', 'subscribe', 'unsubscribe']);
        (messenger.subscribe as jasmine.Spy).and.callFake((event, listener) => {
            dict[event] = listener;
        });

        service = new AppAlgorithmService(messenger, new MockZone({}));
    });

    afterEach(() => {
        service.ngOnDestroy();
    });

    it('should call publish', () => {
        expect(messenger.publish).toHaveBeenCalled();
    });

    it('should call change subject when all called', (done) => {
        service.algorithmsChanged.subscribe((value) => {
            expect(value.length).toBe(1);
            done();
        });
        dict[AlgorithmEvents.All](AlgorithmEvents.All, [
            { id: 1 }
        ]);
    });

    it('all should return 2 for 2 datasets', () => {
        dict[AlgorithmEvents.All](AlgorithmEvents.All, [
            { id: 1 },
            { id: 2 },
        ]);
        expect(service.all().length).toBe(2);
    });

    it('all should return 1 for 1 datasets in experiment 1', () => {
        dict[AlgorithmEvents.All](AlgorithmEvents.All, [
            { id: 1, experimentId: 1 },
            { id: 2, experimentId: 2 },
        ]);
        expect(service.all(1).length).toBe(1);
    });

    it('create should call change subject', (done) => {
        service.algorithmsChanged.subscribe((value) => {
            expect(value.length).toBe(1);
            done();
        });
        dict[AlgorithmEvents.Create](AlgorithmEvents.Create,
            { id: 1 }
        );
    });

    it('create twice should call only once', () => {
        const myFunc = jasmine.createSpy("myFunc");
        service.algorithmsChanged.subscribe(myFunc);
        dict[AlgorithmEvents.Create](AlgorithmEvents.Create,
            { id: 1 }
        );
        dict[AlgorithmEvents.Create](AlgorithmEvents.Create,
            { id: 1 }
        );
        expect(myFunc).toHaveBeenCalledTimes(1);
    });

    it('create should call create subect', (done) => {
        service.algorithmCreated.subscribe((value) => {
            expect(value.id).toBe(1);
            done();
        });
        dict[AlgorithmEvents.Create](AlgorithmEvents.Create,
            { id: 1 }
        );
    });

    it('delete event should call delete once subject', () => {
        const myFunc = jasmine.createSpy("myFunc");
        dict[AlgorithmEvents.Create](AlgorithmEvents.Create,
            { id: 1 }
        );
        service.algorithmDeleted.subscribe(myFunc);
        dict[AlgorithmEvents.Delete](AlgorithmEvents.Delete,
            1
        );
        dict[AlgorithmEvents.Delete](AlgorithmEvents.Delete,
            1
        );
        expect(myFunc).toHaveBeenCalledTimes(1);
    });


    it('delete event should call change subject', (done) => {
        dict[AlgorithmEvents.Create](AlgorithmEvents.Create,
            { id: 1 }
        );
        service.algorithmsChanged.subscribe((value) => {
            expect(value.length).toBe(0);
            done();
        });
        dict[AlgorithmEvents.Delete](AlgorithmEvents.Delete,
            1
        );
    });

    it('get should throw error for not found', () => {
        expect(() => {
            service.get(404);
        }).toThrow();
    });

    it('get should return algorithm', () => {
        dict[AlgorithmEvents.Create](AlgorithmEvents.Create,
            { id: 1, experimentId: 1 }
        );
        const algorithm = service.get(1);
        expect(algorithm.experimentId).toBe(1);
    });
    it('delete should call messegner', (done) => {
        (messenger.publish as jasmine.Spy).and.callFake((event, id) => {
            expect(event).toBe(AlgorithmEvents.Delete);
            expect(id).toBe(1);
            done();
        });
        service.delete(1);
    });

    it('update event should call algorithm changed when not found', (done) => {
        service.algorithmsChanged.subscribe((value) => {
            expect(value.length).toBe(1);
            done();
        });
        dict[AlgorithmEvents.Update](AlgorithmEvents.Update,
            { id: 1 }
        );
    });
    
    it('update event should call algorithm update when found', (done) => {
        dict[AlgorithmEvents.Create](AlgorithmEvents.Create,
            { id: 1 }
        );
        service.algorithmUpdated.subscribe((value) => {
            expect(value.id).toBe(1);
            expect(value.name).toBe('new name');
            done();
        });
        dict[AlgorithmEvents.Update](AlgorithmEvents.Update,
            { id: 1, name: 'new name' }
        );
    });

    it('update should call messegner', (done) => {
        (messenger.publish as jasmine.Spy).and.callFake((event, id, name, time) => {
            expect(event).toBe(AlgorithmEvents.Update);
            expect(id).toBe(1);
            expect(name).toBe('name');
            expect(time).toBe(200);
            done();
        });
        service.update(1, 'name', 200);
    });

    it('start should call messegner', (done) => {
        (messenger.publish as jasmine.Spy).and.callFake((event, id) => {
            expect(event).toBe(AlgorithmEvents.Start);
            expect(id).toBe(1);
            done();
        });
        service.start(1);
    });

    it('stop should call messegner', (done) => {
        (messenger.publish as jasmine.Spy).and.callFake((event, id) => {
            expect(event).toBe(AlgorithmEvents.Stop);
            expect(id).toBe(1);
            done();
        });
        service.stop(1);
    });

    it('export should call messegner', (done) => {
        (messenger.publish as jasmine.Spy).and.callFake((event, id, language) => {
            expect(event).toBe(AlgorithmEvents.Export);
            expect(id).toBe(1);
            expect(language).toBe('language');
            done();
        });
        service.export(1, 'language');
    });




});


