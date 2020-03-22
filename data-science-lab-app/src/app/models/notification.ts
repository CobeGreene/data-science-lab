export class Notification {
    type: string;
    header: string;
    message: string;
    action?: { label: string, href: string, event: string };
}
