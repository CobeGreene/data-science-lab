import { TabService } from './tab.service';
import { Tab } from '../../models/tab';

export class AppTabService extends TabService {
    tabs: Tab[];

    constructor() {
        super();

        this.tabs = [];
    }

    all(): Tab[] {
        return this.tabs;
    }

    openTab(tab: Tab) {
        const find = this.tabs.findIndex(value => value.route === tab.route);
        if (find >= 0) {
            this.closeTab(this.tabs[find]);
            this.tabs.splice(find, 1, tab);
            this.tabOpened.next({
                index: find,
                tabs: this.tabs
            });
        } else {
            this.tabs.push(tab);
            this.tabOpened.next({
                index: this.tabs.length - 1,
                tabs: this.tabs
            });
        }
    }

    replaceTab(route: string, tab: Tab) {
        const find = this.tabs.findIndex(value => value.route === route);
        if (find >= 0) {
            this.closeTab(this.tabs[find]);
            let alreadyOpen = this.tabs.findIndex((value) => {
                return value.route === tab.route;
            });
            if (alreadyOpen >= 0) {
                this.tabs.splice(find, 1);
                if (find !== alreadyOpen) {
                    alreadyOpen = this.tabs.findIndex((value) => {
                        return value.route === tab.route;
                    });
                    this.closeTab(this.tabs[alreadyOpen]);
                    this.tabs.splice(alreadyOpen, 1, tab);
                } else {
                    this.tabs.splice(alreadyOpen, 0, tab);
                }
                this.tabReplaced.next({
                    tabs: this.tabs,
                    index: alreadyOpen
                });
            } else {
                this.tabs.splice(find, 1, tab);
                this.tabReplaced.next({
                    index: find,
                    tabs: this.tabs
                });
            }
        } else {
            throw new Error(`Couldn't find tab with route ${route}.`);
        }
    }

    removeTab(route: string) {
        const find = this.tabs.findIndex(value => value.route === route);
        if (find >= 0) {
            const tab = this.tabs.splice(find, 1)[0];
            this.closeTab(tab);
            this.tabsChanged.next(this.tabs);
        } else {
            throw new Error(`Couldn't find tab with route ${route}.`);
        }
    }

    findOrDefault(route: string): Tab | undefined {
        return this.tabs.find((value) => {
            return value.route === route;
        });
    }

    reopenTab(route: string) {
        const find = this.tabs.findIndex(value => value.route === route);
        if (find >= 0) {
            this.tabOpened.next({
                tabs: this.tabs,
                index: find
            });
        } else {
            throw new Error(`Couldn't find tab with route ${route}.`);
        }
    }

    private closeTab(tab: Tab) {
        if (tab.sub !== undefined && tab.sub !== null) {
            tab.sub.unsubscribe();
        }
        if (tab.close !== undefined && tab.close !== null) {
            tab.close();
        }
    }

} 
