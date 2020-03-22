import { Tab } from '../../models';
import { Subject } from 'rxjs';

export interface TabBuilder {
    build(): Tab;
    buildPrefix(prefix: string): TabBuilder;
    buildRoute(route: string): TabBuilder;
    buildUpdate(subject: Subject<any>): TabBuilder;
    buildDelete(subject: Subject<any>): TabBuilder;
    buildFinish(subject: Subject<any>): TabBuilder;
    buildClose(close: (id: number) => void): TabBuilder;
}
