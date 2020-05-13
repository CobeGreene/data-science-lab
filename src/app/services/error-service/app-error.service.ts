import { Injectable, NgZone } from '@angular/core';
import { ErrorService } from './error.service';
import { Messenger } from '../messenger';
import { NotificationService } from '../notification-service';
import { ErrorEvent, OpenLinkEvent } from '../../../../shared/events';
import { SystemError, PackageError } from '../../../../shared/errors';

@Injectable()
export class AppErrorService extends ErrorService {

    constructor(messenger: Messenger, zone: NgZone, private notificationService: NotificationService) {
        super(messenger, zone)/* istanbul ignore next */;

        this.registerEvents();
    }

    registerEvents() {
        this.messenger.subscribe(ErrorEvent, this.errorEvent);
    }

    unregisterEvents() {
        this.messenger.unsubscribe(ErrorEvent, this.errorEvent);
    }

    private errorEvent = (_event, error: any) => {
        this.zone.run(() => {
            if (error instanceof Error) {
                this.notificationService.push({
                    header: error.name,
                    message: error.message,
                    type: 'error',
                });
            } else if ((error as PackageError).issues !== undefined) {
                this.notificationService.push({
                    header: error.header,
                    message: error.description,
                    type: error.type,
                    action: {
                        event: OpenLinkEvent,
                        href: error.issues,
                        label: 'Issues'
                    }
                });

            } else {
                this.notificationService.push({
                    header: error.header,
                    message: error.description,
                    type: error.type,
                });
            }
            
            this.errorCreated.next(error);
        });
    }


}
