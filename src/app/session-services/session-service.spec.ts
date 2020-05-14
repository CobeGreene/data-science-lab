import { SessionService } from './session-service';
import { Messenger } from '../services/messenger';
import { Listener } from '../../../shared/services';
import { MockZone } from '../services/mock-zone';
import { Plugin } from '../../../shared/models';


class MockSessionService extends SessionService {
    get eventCreate(): string {
        return 'Create';
    } 
    get eventUpdate(): string {
        return 'Update';
    }
    get eventDelete(): string {
        return 'Delete';
    }
    get eventFinish(): string {
        return 'Finish';
    }
    get eventSelect(): string {
        return 'Select';
    }
    get eventOptions(): string {
        return 'Options';
    }
    get eventCommand(): string {
        return 'Command';
    }
    get eventInput(): string {
        return 'Input';
    }
    get eventPrevious(): string {
        return 'Previous';
    }
} 

describe('Angular Session Service', () => {
    let service: MockSessionService;
    let messenger: Messenger;
    const dict: { [event: string]: Listener } = {};

    beforeEach(() => {
        messenger = jasmine.createSpyObj('Messenger', ['publish', 'subscribe', 'unsubscribe']);
        (messenger.subscribe as jasmine.Spy).and.callFake((event, listener) => {
            dict[event] = listener;
        });
        service = new MockSessionService(messenger, new MockZone({}));
    });

    afterEach(() => {
        service.ngOnDestroy();
    });

    it('should call publish create when creating', (done) => {
        (messenger.publish as jasmine.Spy).and.callFake((event, id, options) => {
            expect(event).toBe('Create');
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
        dict['Create']('Create', { id: 1 });
    });

    it('get should throw for unknown session', () => {
        expect(() => service.get(1)).toThrowError();
    });

    it('get should return session that was created', () => {
        // tslint:disable-next-line: no-string-literal
        dict['Create']('Create', { id: 1, keyId: 2 });
        const session = service.get(1);

        expect(session.keyId).toBe(2);
    }); 

    it('delete should call publish', (done) => {
        (messenger.publish as jasmine.Spy).and.callFake((event, id) => {
            expect(event).toBe('Delete');
            expect(id).toBe(1);
            done();
        });
        
        service.delete(1);
    });

    it('create twice should call only once', () => {
        const myFunc = jasmine.createSpy("myFunc");
        service.sessionCreated.subscribe(myFunc);
        dict['Create']('Create',
            { id: 1 }
        );
        dict['Create']('Create',
            { id: 1 }
        );
        expect(myFunc).toHaveBeenCalledTimes(1);
    });

    
    it('delete event should call delete once subject', () => {
        const myFunc = jasmine.createSpy("myFunc");
        dict['Create']('Create',
            { id: 1 }
        );
        service.sessionDeleted.subscribe(myFunc);
        dict['Delete']('Delete',
            1
        );
        dict['Delete']('Delete',
            1
        );
        expect(myFunc).toHaveBeenCalledTimes(1);
    });

    it('update event should call session changed when not found', (done) => {
        service.sessionUpdated.subscribe((value) => {
            expect(value.id).toBe(1);
            done();
        });
        dict['Update']('Update',
            { id: 1 }
        );
    });
    
    it('update event should call session update when found', (done) => {
        dict['Create']('Create',
            { id: 1 }
        );
        service.sessionUpdated.subscribe((value) => {
            expect(value.id).toBe(1);
            done();
        });
        dict['Update']('Update',
            { id: 1, name: 'new name' }
        );
    });

    it('finish should not call if already finish', () => {
        const myFunc = jasmine.createSpy('Func');
        service.sessionFinished.subscribe(myFunc);
        dict['Finish']('Finish',
            { id: 1 }
        );
        expect(myFunc).toHaveBeenCalledTimes(0);
    });

    it('delete should call subject deleted', (done) => {
        // tslint:disable-next-line: no-string-literal
        dict['Create']('Create', { id: 1, keyId: 2 });
        service.sessionDeleted.subscribe((value) => {
            expect(value).toBe(1);
            done();
        });
        // tslint:disable-next-line: no-string-literal
        dict['Delete']('Delete', 1);
    });
    

    it('finish should call subject finish', (done) => {
        // tslint:disable-next-line: no-string-literal
        dict['Create']('Create', { id: 1, keyId: 2 });
        service.sessionFinished.subscribe(({ id, returnPath }) => {
            expect(id).toBe(1);
            expect(returnPath).toBe('return');
            done();
        });
        // tslint:disable-next-line: no-string-literal
        dict['Finish']('Finish', 1, 'return');
    });

    it('attempt delete should not call if session doesn\'t exists', () => {
        service.attemptDelete(1);

        expect(messenger.publish).toHaveBeenCalledTimes(0);
    });

    it('attempt delete should call publish if session exists', (done) => {
        // tslint:disable-next-line: no-string-literal
        dict['Create']('Create', { id: 1, keyId: 2 });
        (messenger.publish as jasmine.Spy).and.callFake((event, id) => {
            expect(event).toBe('Delete');
            expect(id).toBe(1);
            done();
        });        
        service.attemptDelete(1);
    });

    it('select should call publisher session', (done) => {
        (messenger.publish as jasmine.Spy).and.callFake((event, id) => {
            expect(event).toBe('Select');
            expect(id).toBe(1);
            done();
        });

        // tslint:disable-next-line: no-object-literal-type-assertion
        service.select(1, {} as Plugin);
    });
    
    it('input options should call publisher session', (done) => {
        (messenger.publish as jasmine.Spy).and.callFake((event, id) => {
            expect(event).toBe('Options');
            expect(id).toBe(1);
            done();
        });

        service.inputOptions(1, {});
    });
    
    it('execute command should call publisher session', (done) => {
        (messenger.publish as jasmine.Spy).and.callFake((event, id) => {
            expect(event).toBe('Command');
            expect(id).toBe(1);
            done();
        });

        service.executeCommand(1, '');
    });

    it('input dictionary should call publisher session', (done) => {
        (messenger.publish as jasmine.Spy).and.callFake((event, id) => {
            expect(event).toBe('Input');
            expect(id).toBe(1);
            done();
        });

        service.inputDictionary(1, {});
    });
    
    it('previous should call publisher session', (done) => {
        (messenger.publish as jasmine.Spy).and.callFake((event, id) => {
            expect(event).toBe('Previous');
            expect(id).toBe(1);
            done();
        });
        service.previous(1);
    });

});

