import { AppTrackerService } from "./app-tracker.service";
import { Messenger } from "../messenger";
import { Listener } from "../../../../shared/services";
import { MockZone } from "../mock-zone";
import { TrackerEvents } from "../../../../shared/events";



describe('Angular App Tracker Service', () => {
    let service: AppTrackerService;
    let messenger: Messenger;
    const dict: { [event: string]: Listener } = {};

    beforeEach(() => {
        messenger = jasmine.createSpyObj('Messenger', ['publish', 'subscribe', 'unsubscribe']);
        (messenger.subscribe as jasmine.Spy).and.callFake((event, listener) => {
            dict[event] = listener;
        });

        service = new AppTrackerService(messenger, new MockZone({}));
    });

    afterEach(() => {
        service.ngOnDestroy();
    });

    it('should call publish', () => {
        expect(messenger.publish).toHaveBeenCalled();
    });

    it('should call change subject when all called', (done) => {
        service.trackersChanged.subscribe((value) => {
            expect(value.length).toBe(1);
            done();
        });
        dict[TrackerEvents.All](TrackerEvents.All, [
            { algorithmId: 1 }
        ]);
    });

    it('all should return 2 for 2 trackers', () => {
        dict[TrackerEvents.All](TrackerEvents.All, [
            { algorithmId: 1 },
            { algorithmId: 2 },
        ]);
        expect(service.all().length).toBe(2);
    });


    it('create should call change subject', (done) => {
        service.trackersChanged.subscribe((value) => {
            expect(value.length).toBe(1);
            done();
        });
        dict[TrackerEvents.Create](TrackerEvents.Create, 
            { algorithmId: 1 }    
        );
    });
    
    it('create should call create subect', (done) => {
        service.trackerCreated.subscribe((value) => {
            expect(value.algorithmId).toBe(1);
            done();
        });
        dict[TrackerEvents.Create](TrackerEvents.Create, 
            { algorithmId: 1 }    
        );
    });

    it('create twice should call only once', () => {
        const myFunc = jasmine.createSpy("myFunc");
        service.trackerCreated.subscribe(myFunc);
        dict[TrackerEvents.Create](TrackerEvents.Create,
            { algorithmId: 1 }
        );
        dict[TrackerEvents.Create](TrackerEvents.Create,
            { algorithmId: 1 }
        );
        expect(myFunc).toHaveBeenCalledTimes(1);
    });

    it('delete event should call delete once subject', () => {
        const myFunc = jasmine.createSpy("myFunc");
        dict[TrackerEvents.Create](TrackerEvents.Create,
            { algorithmId: 1 }
        );
        service.trackerDeleted.subscribe(myFunc);
        dict[TrackerEvents.Delete](TrackerEvents.Delete,
            1
        );
        dict[TrackerEvents.Delete](TrackerEvents.Delete,
            1
        );
        expect(myFunc).toHaveBeenCalledTimes(1);
    });


    it('delete event should call delete subject', (done) => {
        dict[TrackerEvents.Create](TrackerEvents.Create, 
            { algorithmId: 1 }    
        );
        service.trackerDeleted.subscribe((value) => {
            expect(value).toBe(1);
            done();
        });
        dict[TrackerEvents.Delete](TrackerEvents.Delete, 
            1    
        );
    });

    
    it('delete event should call change subject', (done) => {
        dict[TrackerEvents.Create](TrackerEvents.Create, 
            { algorithmId: 1 }    
        );
        service.trackersChanged.subscribe((value) => {
            expect(value.length).toBe(0);
            done();
        });
        dict[TrackerEvents.Delete](TrackerEvents.Delete, 
            1    
        );
    });

    
    it('should call change subject when update without existing', (done) => {
        service.trackersChanged.subscribe((value) => {
            expect(value.length).toBe(1);
            done();
        });
        dict[TrackerEvents.Update](TrackerEvents.Update, { algorithmId: 1 });
    });

    it('should call update subject when update', (done) => {
        dict[TrackerEvents.Create](TrackerEvents.Create, { algorithmId: 1 });
        service.trackerUpdated.subscribe((value) => {
            expect(value.algorithmId).toBe(1);
            done();
        });

        dict[TrackerEvents.Update](TrackerEvents.Update, { algorithmId: 1 });
    });

    it('get should throw error for not found', () => {
        expect(() => {
            service.get(404);
        }).toThrow();
    });
    
    it('get should return algorithm', () => {
        dict[TrackerEvents.Create](TrackerEvents.Create, { algorithmId: 1, variables: undefined, recentIterations: undefined });
        const algorithm = service.get(1);
        expect(algorithm).toEqual({ algorithmId: 1, variables: undefined, recentIterations: undefined });
    });
    
    it('has should return false for no algorithms', () => {
        expect(service.has(404)).toBeFalsy();
    });
    
    it('has should return false for no algorithms', () => {
        dict[TrackerEvents.Create](TrackerEvents.Create, 
            { algorithmId: 1 }    
        );
        expect(service.has(1)).toBeTruthy();
    });

});






