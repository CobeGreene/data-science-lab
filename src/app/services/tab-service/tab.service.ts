import { Subject } from 'rxjs';
import { Tab } from '../../models/tab';


export abstract class TabService {
    tabsChanged: Subject<Tab[]>;
    tabReplaced: Subject<{ index: number, tabs: Tab[] }>;
    tabOpened: Subject<{ index: number, tabs: Tab[] }>;

    constructor() {
        this.tabsChanged = new Subject<Tab[]>();
        this.tabReplaced = new Subject<{ index: number, tabs: Tab[] }>();
        this.tabOpened = new Subject<{ index: number, tabs: Tab[] }>();
    }

    abstract all(): Tab[];
    abstract openTab(tab: Tab);
    abstract replaceTab(route: string, tab: Tab);
    abstract removeTab(route: string);
    abstract findOrDefault(route: string): Tab | undefined;
    abstract reopenTab(route: string);
    abstract closeAll(except?: string[]);
}
