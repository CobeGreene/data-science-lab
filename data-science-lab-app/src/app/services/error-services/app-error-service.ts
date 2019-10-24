import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { ErrorService } from './error-service';
import { IpService } from '../../../../shared/services/ip.service';
import { ErrorEvents } from '../../../../shared/events';
import { Subject } from 'rxjs';
import { ErrorExceptionList, ErrorException } from '../../models';

@Injectable()
export class AppErrorService implements ErrorService, OnDestroy {
    public errorsChanged: Subject<ErrorExceptionList>;
    private errorsList: ErrorExceptionList;
    private id: 1;

    constructor(private ipService: IpService, private zone: NgZone) {
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
        this.ipService.on(ErrorEvents.ExceptionListeners, this.exceptionEvent);
    }

    private unregisterErrorEvent(): void {
        this.ipService.removeListener(ErrorEvents.ExceptionListeners, this.exceptionEvent);
    }

    private exceptionEvent = (event, arg): void => {
        this.zone.run(() => {
            const error = new ErrorException({
                id: this.id++,
                message: arg[0]
            });
            this.errorsList.errors.push(error);
            this.errorsChanged.next(this.all());
        });
    }

}
