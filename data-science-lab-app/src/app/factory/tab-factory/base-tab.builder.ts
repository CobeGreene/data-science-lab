import { TabBuilder } from './tab.builder';
import { Tab } from '../../models';
import { Subject } from 'rxjs';


export abstract class BaseTabBuilder implements TabBuilder {

    constructor(public tab: Tab) {
    }
    
    abstract build(): Tab;
    
    buildPrefix(prefix: string): TabBuilder {
        this.tab.name = `${prefix}${this.tab.name}`;
        this.tab.data.prefix = prefix;
        return this;
    }
    buildRoute(route: string): TabBuilder {
        this.tab.route = `${this.tab.route}/${route}`;
        return this;
    }

    abstract buildUpdate(subject: Subject<any>): TabBuilder;
    abstract buildDelete(subject: Subject<any>): TabBuilder;
    abstract buildFinish(subject: Subject<any>): TabBuilder;
    abstract buildClose(close: (id: number) => void): TabBuilder;


}

