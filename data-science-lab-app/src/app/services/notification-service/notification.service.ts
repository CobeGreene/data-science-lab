import { Notification } from '../../models';


export abstract class NotificationService {
    abstract push(notification: Notification);
    abstract pop();
    abstract execute(event: string, link: string);
}
