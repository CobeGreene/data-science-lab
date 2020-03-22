import { NotificationService } from './notification.service';
import { Notification } from '../../models';
import { Injector, Injectable } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { PortalInjector, ComponentPortal } from '@angular/cdk/portal';
import { NotificationComponent } from '../../shared/notification/notification.component';
import { Messenger } from '../messenger';

@Injectable()
export class AppNotificationService extends NotificationService {

    private notifications: Notification[];
    private overlayRef: OverlayRef | undefined;
    private timer: NodeJS.Timer | undefined;

    constructor(
        private messenger: Messenger,
        private overlay: Overlay,
        private parentInjector: Injector) {
        super();
        this.notifications = [];
    }

    push(notification: Notification) {
        this.notifications.push(notification);

        if (this.notifications.length === 1) {
            this.overlayRef = this.create(this.notifications[0]);
            this.timer = setTimeout(() => {
                this.pop();
            }, 3000);
        }
    }

    create(notification: Notification): OverlayRef {
        const positionStrategy = this.overlay
            .position().global()
            .bottom('0').right('0');

        const overlayRef = this.overlay.create({ positionStrategy });

        const tokens = new WeakMap();
        tokens.set(Notification, notification);
        tokens.set(NotificationService, this);
        const injector = new PortalInjector(this.parentInjector, tokens);
        const portal = new ComponentPortal(NotificationComponent, null, injector);

        overlayRef.attach(portal);

        return overlayRef;
    }

    pop() {
        if (this.timer) {
            clearTimeout(this.timer);
        }

        if (this.overlayRef) {
            this.overlayRef.dispose();
        }

        if (this.notifications.length > 0) {
            this.notifications.shift();
        }
        
        if (this.notifications.length > 0) {
            this.overlayRef = this.create(this.notifications[0]);
            this.timer = setTimeout(() => {
                this.pop();
            }, 3000);
        }

        this.timer = undefined;
    }

    execute(event: string, link: string) {
        this.messenger.publish(event, link);        
    }

}


