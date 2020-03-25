import { AppVisualizationService } from "./app-visualization.service";
import { Messenger } from "../messenger";
import { Listener } from "../../../../shared/services";
import { MockZone } from "../mock-zone";
import { VisualEvents } from "../../../../shared/events";


describe('Angular App Visualization Service', () => {
    let service: AppVisualizationService;
    let messenger: Messenger;
    const dict: { [event: string]: Listener } = {};

    beforeEach(() => {
        messenger = jasmine.createSpyObj('Messenger', ['publish', 'subscribe', 'unsubscribe']);
        (messenger.subscribe as jasmine.Spy).and.callFake((event, listener) => {
            dict[event] = listener;
        });

        service = new AppVisualizationService(messenger, new MockZone({}));
    });

    
    it('should call publish', () => {
        expect(messenger.publish).toHaveBeenCalled();
    });

    it('should call change subject when all called', (done) => {
        service.visualsChanged.subscribe((value) => {
            expect(value.length).toBe(1);
            done();
        });
        dict[VisualEvents.All](VisualEvents.All, [
            { id: 1 }
        ]);
    });

    it('all should return 2 for 2 visuals', () => {
        dict[VisualEvents.All](VisualEvents.All, [
            { id: 1 },
            { id: 2 },
        ]);
        expect(service.all().length).toBe(2);
    });

    it('all should return 1 for 1 visuals in experiment 1', () => {
        dict[VisualEvents.All](VisualEvents.All, [
            { id: 1, experimentId: 1 },
            { id: 2, experimentId: 2 },
        ]);
        expect(service.all(1).length).toBe(1);
    });

    it('create should call change subject', (done) => {
        service.visualsChanged.subscribe((value) => {
            expect(value.length).toBe(1);
            done();
        });
        dict[VisualEvents.Create](VisualEvents.Create, 
            { id: 1 }    
        );
    });
    
    it('create should call create subect', (done) => {
        service.visualCreated.subscribe((value) => {
            expect(value.id).toBe(1);
            done();
        });
        dict[VisualEvents.Create](VisualEvents.Create, 
            { id: 1 }    
        );
    });

    it('delete event should call delete subject', (done) => {
        dict[VisualEvents.Create](VisualEvents.Create, 
            { id: 1 }    
        );
        service.visualDeleted.subscribe((value) => {
            expect(value).toBe(1);
            done();
        });
        dict[VisualEvents.Delete](VisualEvents.Delete, 
            1    
        );
    });

    
    it('delete event should call change subject', (done) => {
        dict[VisualEvents.Create](VisualEvents.Create, 
            { id: 1 }    
        );
        service.visualsChanged.subscribe((value) => {
            expect(value.length).toBe(0);
            done();
        });
        dict[VisualEvents.Delete](VisualEvents.Delete, 
            1    
        );
    });

    it('get should throw error for not found', () => {
        expect(() => {
            service.get(404);
        }).toThrow();
    });

    it('get should return dataset', () => {
        dict[VisualEvents.Create](VisualEvents.Create, 
            { id: 1, experimentId: 1 }    
        );
        const dataset = service.get(1);
        expect(dataset.experimentId).toBe(1);
    });
    it('delete should call messegner', (done) => {
        (messenger.publish as jasmine.Spy).and.callFake((event, id) => {
            expect(event).toBe(VisualEvents.Delete);
            expect(id).toBe(1);
            done();
        });
        service.delete(1);
    });
    
    it('resize should call messegner', (done) => {
        (messenger.publish as jasmine.Spy).and.callFake((event, id, width, height) => {
            expect(event).toBe(VisualEvents.Resize);
            expect(id).toBe(1);
            expect(width).toBe(20);
            expect(height).toBe(40);
            done();
        });
        service.resize(1, 20, 40);
    });
    
    it('reposition should call messegner', (done) => {
        (messenger.publish as jasmine.Spy).and.callFake((event, id, top, left) => {
            expect(event).toBe(VisualEvents.Reposition);
            expect(id).toBe(1);
            expect(top).toBe(20);
            expect(left).toBe(40);
            done();
        });
        service.reposition(1, 20, 40);
    });


});

