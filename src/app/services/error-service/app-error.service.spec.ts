import { AppErrorService } from "./app-error.service";
import { Messenger } from "../messenger";
import { Listener } from "../../../../shared/services";
import { NotificationService } from "../notification-service";
import { MockZone } from "../mock-zone";
import { ErrorEvent, OpenLinkEvent } from "../../../../shared/events";
import { PackageError, ErrorTypes } from "../../../../shared/errors";



describe('Angular App Error Service', () => {
    let service: AppErrorService;
    let messenger: Messenger;
    let notificationService: NotificationService;
    const dict: { [event: string]: Listener } = {};
    
    beforeEach(() => {
        messenger = jasmine.createSpyObj('Messenger', ['publish', 'subscribe', 'unsubscribe']);
        (messenger.subscribe as jasmine.Spy).and.callFake((event, listener) => {
            dict[event] = listener;
        });
        notificationService = jasmine.createSpyObj('NotificationService', ['push']);

        service = new AppErrorService(messenger, new MockZone({}), notificationService);
    });

    it('error event should push error instance', () => {
        dict[ErrorEvent](ErrorEvent, 
            new Error('error')
        );
        expect(notificationService.push).toHaveBeenCalledTimes(1);
        expect(notificationService.push).toHaveBeenCalledWith({
            header: 'Error',
            message: 'error',
            type: 'error'
        });
    });

    it('error event should push package error', () => {
        const packageError: PackageError = {
            description: 'description',
            header: 'header',
            issues: 'href',
            type: ErrorTypes.Warning
        };
        dict[ErrorEvent](ErrorEvent, 
            packageError
        );
        expect(notificationService.push).toHaveBeenCalledTimes(1);
        expect(notificationService.push).toHaveBeenCalledWith({
            header: packageError.header,
            message: packageError.description,
            type: packageError.type,
            action: {
                event: OpenLinkEvent,
                href: packageError.issues,
                label: 'Issues'
            }
        });
    });

    it('error event should push error instance', () => {
        dict[ErrorEvent](ErrorEvent, 
            {
                header: 'header',
                description: 'desc',
                type: ErrorTypes.Warning
            }
        );
        expect(notificationService.push).toHaveBeenCalledTimes(1);
        expect(notificationService.push).toHaveBeenCalledWith({
            header: 'header',
            message: 'desc',
            type: ErrorTypes.Warning
        });
    });



    
});

