import { MockZone } from '../mock-zone';
import { AppErrorService } from './app-error-service';
import { ErrorEvents } from '../../../../shared/events'; 
import { MockIpcService } from '../../../../shared/services';
import { ErrorExceptionList } from '../../models';

describe('Angular App Error Service Tests', () => {
    let errorService: AppErrorService;
    let ipcService: MockIpcService;
    let zone: MockZone;

    beforeAll(() => {
        zone = new MockZone({});
    });
    
    
    beforeEach(() => {
        ipcService = new MockIpcService();
        errorService = new AppErrorService(ipcService, zone);
    });

    it('all should return empty list', () => {
        expect(errorService.all().errors.length).toBe(0);
    });  

    it('all should update error changes with new error', (done) => {
        errorService.errorsChanged.subscribe((value: ErrorExceptionList) => {
            expect(value.errors.length).toBe(1);
            done();
        });
        ipcService.send(ErrorEvents.ExceptionListeners, 'message');
    });

    it('get should return message with new error', (done) => {
        errorService.errorsChanged.subscribe((value: ErrorExceptionList) => {
            const error = errorService.get(value.errors[0].id);
            expect(error.message).toEqual('message');
            done();
        });
        ipcService.send(ErrorEvents.ExceptionListeners, 'message');
    });

    it('get should throw exception for no errors', () => {
        expect(() => {
            errorService.get(404);
        }).toThrowError();
    });

    it('get should throw exception even with errors', () => {
        ipcService.send(ErrorEvents.ExceptionListeners, 'message1');
        ipcService.send(ErrorEvents.ExceptionListeners, 'message2');
        expect(() => {
            errorService.get(404);
        }).toThrowError();
    });

    it('remove should update errors changed with no errors', (done) => {
        ipcService.send(ErrorEvents.ExceptionListeners, 'message');
        const errorId = errorService.all().errors[0].id;
        errorService.errorsChanged.subscribe((value: ErrorExceptionList) => {
            expect(value.errors.length).toBe(0);
            done();
        });
        errorService.remove(errorId);
    });

    it('remove should throw for no errors', () => {
        expect(() => {
            errorService.remove(404);
        }).toThrowError();
    });

    it('remove should throw with errors', () => {
        ipcService.send(ErrorEvents.ExceptionListeners, 'message1');
        ipcService.send(ErrorEvents.ExceptionListeners, 'message2');
        expect(() => {
            errorService.remove(404);
        }).toThrowError();        
    });

});
