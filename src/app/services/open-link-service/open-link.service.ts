import { Service } from '../service';

export abstract class OpenLinkService extends Service {

    abstract open(href: string);
}
