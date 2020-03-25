import { AppTestReportSessionService } from "./app-test-report.session-service";
import { Messenger } from "../../services/messenger";
import { Listener } from "../../../../shared/services";
import { MockZone } from "../../services/mock-zone";
import { TestReportCreateEvents } from "../../../../shared/events";
import { Plugin } from "../../../../shared/models";



describe('Angular App Test Report Session Service', () => {
    let service: AppTestReportSessionService;

    let messenger: Messenger;
    const dict: { [event: string]: Listener } = {};

    beforeEach(() => {
        messenger = jasmine.createSpyObj('Messenger', ['publish', 'subscribe', 'unsubscribe']);
        (messenger.subscribe as jasmine.Spy).and.callFake((event, listener) => {
            dict[event] = listener;
        });
        service = new AppTestReportSessionService(messenger, new MockZone({}));
    });

    
    it('should call publish create when creating', (done) => {
        (messenger.publish as jasmine.Spy).and.callFake((event, id, options) => {
            expect(event).toBe(TestReportCreateEvents.Create);
            expect(id).toBe(1);
            done();
        });
        service.create(1, {
            currentRoute: '',
            newTab: false
        });
    });

    it('create should call subject session created', (done) => {
        service.sessionCreated.subscribe((id) => {
            expect(id).toBe(1);
            done();
        });
        // tslint:disable-next-line: no-string-literal
        dict[TestReportCreateEvents.Create](TestReportCreateEvents.Create, { id: 1 });
    });

    it('get should throw for unknown session', () => {
        expect(() => service.get(1)).toThrowError();
    });

    it('get should return session that was created', () => {
        // tslint:disable-next-line: no-string-literal
        dict[TestReportCreateEvents.Create](TestReportCreateEvents.Create, { id: 1, algorithmId: 2 });
        const session = service.get(1);

        expect(session.algorithmId).toBe(2);
    }); 

    it('delete should call publish', (done) => {
        (messenger.publish as jasmine.Spy).and.callFake((event, id) => {
            expect(event).toBe(TestReportCreateEvents.Delete);
            expect(id).toBe(1);
            done();
        });
        
        service.delete(1);
    });

    it('delete should call subject deleted', (done) => {
        // tslint:disable-next-line: no-string-literal
        dict[TestReportCreateEvents.Create](TestReportCreateEvents.Create, { id: 1, keyId: 2 });
        service.sessionDeleted.subscribe((value) => {
            expect(value).toBe(1);
            done();
        });
        // tslint:disable-next-line: no-string-literal
        dict[TestReportCreateEvents.Delete](TestReportCreateEvents.Delete, 1);
    });
    

    it('finish should call subject finish', (done) => {
        // tslint:disable-next-line: no-string-literal
        dict[TestReportCreateEvents.Create](TestReportCreateEvents.Create, { id: 1, keyId: 2 });
        service.sessionFinished.subscribe(({ id, returnPath }) => {
            expect(id).toBe(1);
            expect(returnPath).toBe('return');
            done();
        });
        // tslint:disable-next-line: no-string-literal
        dict[TestReportCreateEvents.Finish](TestReportCreateEvents.Finish, 1, 'return');
    });

    it('attempt delete should not call if session doesn\'t exists', () => {
        service.attemptDelete(1);

        expect(messenger.publish).toHaveBeenCalledTimes(0);
    });

    it('attempt delete should call publish if session exists', (done) => {
        // tslint:disable-next-line: no-string-literal
        dict[TestReportCreateEvents.Create](TestReportCreateEvents.Create, { id: 1, algorithmId: 2 });
        (messenger.publish as jasmine.Spy).and.callFake((event, id) => {
            expect(event).toBe(TestReportCreateEvents.Delete);
            expect(id).toBe(1);
            done();
        });        
        service.attemptDelete(1);
    });

    it('select should call publisher session', (done) => {
        (messenger.publish as jasmine.Spy).and.callFake((event, id, datasetId, features) => {
            expect(event).toBe(TestReportCreateEvents.Select);
            expect(id).toBe(1);
            expect(datasetId).toBe(1);
            expect(features).toEqual([]);
            done();
        });

        // tslint:disable-next-line: no-object-literal-type-assertion
        service.select(1, 1, []);
    });
    

    it('input dictionary should call publisher session', (done) => {
        (messenger.publish as jasmine.Spy).and.callFake((event, id) => {
            expect(event).toBe(TestReportCreateEvents.Inputs);
            expect(id).toBe(1);
            done();
        });

        service.inputDictionary(1, {});
    });
    
    it('previous should call publisher session', (done) => {
        (messenger.publish as jasmine.Spy).and.callFake((event, id) => {
            expect(event).toBe(TestReportCreateEvents.Previous);
            expect(id).toBe(1);
            done();
        });
        service.previous(1);
    });


});


