import { AppTestReportService } from "./app-test-report.service";
import { Messenger } from "../messenger";
import { Listener } from "../../../../shared/services";
import { MockZone } from "../mock-zone";
import { TestReportEvents } from "../../../../shared/events";


describe('Angular App Test Report Service', () => {
    let service: AppTestReportService;
    let messenger: Messenger;
    const dict: { [event: string]: Listener } = {};

    beforeEach(() => {
        messenger = jasmine.createSpyObj('Messenger', ['publish', 'subscribe', 'unsubscribe']);
        (messenger.subscribe as jasmine.Spy).and.callFake((event, listener) => {
            dict[event] = listener;
        });

        service = new AppTestReportService(messenger, new MockZone({}));
    });

    afterEach(() => {
        service.ngOnDestroy();
    });

    it('should call publish', () => {
        expect(messenger.publish).toHaveBeenCalled();
    });

    it('should call change subject when all called', (done) => {
        service.testReportsChanged.subscribe((value) => {
            expect(value.length).toBe(1);
            done();
        });
        dict[TestReportEvents.All](TestReportEvents.All, [
            { id: 1 }
        ]);
    });

    it('all should return 2 for 2 reports', () => {
        dict[TestReportEvents.All](TestReportEvents.All, [
            { id: 1 },
            { id: 2 },
        ]);
        expect(service.all().length).toBe(2);
    });

    it('all should return 1 for 1 reports in experiment 1', () => {
        dict[TestReportEvents.All](TestReportEvents.All, [
            { id: 1, algorithmId: 1 },
            { id: 2, algorithmId: 2 },
        ]);
        expect(service.all(1).length).toBe(1);
    });

    it('create should call change subject', (done) => {
        service.testReportsChanged.subscribe((value) => {
            expect(value.length).toBe(1);
            done();
        });
        dict[TestReportEvents.Create](TestReportEvents.Create, 
            { id: 1 }    
        );
    });
    
    it('create should call create subect', (done) => {
        service.testReportCreated.subscribe((value) => {
            expect(value.id).toBe(1);
            done();
        });
        dict[TestReportEvents.Create](TestReportEvents.Create, 
            { id: 1 }    
        );
    });

    it('create twice should call only once', () => {
        const myFunc = jasmine.createSpy("myFunc");
        service.testReportCreated.subscribe(myFunc);
        dict[TestReportEvents.Create](TestReportEvents.Create,
            { id: 1 }
        );
        dict[TestReportEvents.Create](TestReportEvents.Create,
            { id: 1 }
        );
        expect(myFunc).toHaveBeenCalledTimes(1);
    });

    
    it('delete event should call delete once subject', () => {
        const myFunc = jasmine.createSpy("myFunc");
        dict[TestReportEvents.Create](TestReportEvents.Create,
            { id: 1 }
        );
        service.testReportDeleted.subscribe(myFunc);
        dict[TestReportEvents.Delete](TestReportEvents.Delete,
            1
        );
        dict[TestReportEvents.Delete](TestReportEvents.Delete,
            1
        );
        expect(myFunc).toHaveBeenCalledTimes(1);
    });

    it('delete event should call delete subject', (done) => {
        dict[TestReportEvents.Create](TestReportEvents.Create, 
            { id: 1 }    
        );
        service.testReportDeleted.subscribe((value) => {
            expect(value).toBe(1);
            done();
        });
        dict[TestReportEvents.Delete](TestReportEvents.Delete, 
            1    
        );
    });

    
    it('delete event should call change subject', (done) => {
        dict[TestReportEvents.Create](TestReportEvents.Create, 
            { id: 1 }    
        );
        service.testReportsChanged.subscribe((value) => {
            expect(value.length).toBe(0);
            done();
        });
        dict[TestReportEvents.Delete](TestReportEvents.Delete, 
            1    
        );
    });

    
    it('update event should call test report changed when not found', (done) => {
        service.testReportsChanged.subscribe((value) => {
            expect(value.length).toBe(1);
            done();
        });
        dict[TestReportEvents.Update](TestReportEvents.Update,
            { id: 1 }
        );
    });
    
    it('update event should call test report update when found', (done) => {
        dict[TestReportEvents.Create](TestReportEvents.Create,
            { id: 1 }
        );
        service.testReportUpdated.subscribe((value) => {
            expect(value.id).toBe(1);
            expect(value.name).toBe('new name');
            done();
        });
        dict[TestReportEvents.Update](TestReportEvents.Update,
            { id: 1, name: 'new name' }
        );
    });

    it('get should throw error for not found', () => {
        expect(() => {
            service.get(404);
        }).toThrow();
    });

    it('get should return algorithm', () => {
        dict[TestReportEvents.Create](TestReportEvents.Create, 
            { id: 1, algorithmId: 1 }    
        );
        const report = service.get(1);
        expect(report.algorithmId).toBe(1);
    });
    it('delete should call messegner', (done) => {
        (messenger.publish as jasmine.Spy).and.callFake((event, id) => {
            expect(event).toBe(TestReportEvents.Delete);
            expect(id).toBe(1);
            done();
        });
        service.delete(1);
    });
    
    it('rename should call messegner', (done) => {
        (messenger.publish as jasmine.Spy).and.callFake((event, id, name) => {
            expect(event).toBe(TestReportEvents.Rename);
            expect(id).toBe(1);
            expect(name).toBe('name');
            done();
        });
        service.rename(1, 'name');
    });
    
    it('show should call messegner', (done) => {
        (messenger.publish as jasmine.Spy).and.callFake((event, id) => {
            expect(event).toBe(TestReportEvents.Show);
            expect(id).toBe(1);
            done();
        });
        service.show(1);
    });
});
