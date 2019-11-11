import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { ErrorService } from './error-service';
import { IpcService } from '../../../../shared/services';
import { ErrorEvents } from '../../../../shared/events';
import { Subject } from 'rxjs';
import { ErrorExceptionList, ErrorException } from '../../models';

@Injectable()
export class AppErrorService implements ErrorService, OnDestroy {
    public errorsChanged: Subject<ErrorExceptionList>;
    private errorsList: ErrorExceptionList;
    private id: 1;

    constructor(private ipcService: IpcService, private zone: NgZone) {
        this.errorsChanged = new Subject<ErrorExceptionList>();
        this.errorsList = new ErrorExceptionList();
        this.registerErrorEvent();
    }

    ngOnDestroy(): void {
        this.unregisterErrorEvent();
    }

    all(): ErrorExceptionList {
        return this.errorsList;
    }

    get(id: number): ErrorException {
        const find = this.errorsList.errors.find((value: ErrorException) => {
            return value.id === id;
        });
        if (find == null) {
            throw new Error('Coudn\'t find error exception.');
        }
        return find;
    }

    remove(id: number): void {
        this.zone.run(() => {
            const index = this.errorsList.errors.findIndex((value: ErrorException) => {
                return value.id === id;
            });
            if (index > -1) {
                this.errorsList.errors.splice(index, 1);
                this.errorsChanged.next(this.all());
            } else {
                throw new Error('Coudn\'t find error exception.');
            }
        });
    }

    private registerErrorEvent(): void {
        this.ipcService.on(ErrorEvents.ExceptionListeners, this.exceptionEvent);
    }

    private unregisterErrorEvent(): void {
        this.ipcService.removeListener(ErrorEvents.ExceptionListeners, this.exceptionEvent);
    }

    private exceptionEvent = (event, message: string): void => {
        this.zone.run(() => {
            const error = new ErrorException({
                id: this.id++,
                message
            });
            this.errorsList.errors.push(error);
            this.errorsChanged.next(this.all());
        });
    }

}
