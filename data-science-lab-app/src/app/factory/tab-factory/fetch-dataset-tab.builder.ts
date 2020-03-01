import { TabBuilder } from './tab.builder';
import { ExperimentTabBuilder } from './experiment-tab.builder';
import { Tab } from '../../models';
import { BaseTabBuilder } from './base-tab.builder';
import { Subject, Subscription } from 'rxjs';
import { Session } from '../../../../shared/models';

export class FetchDatasetTabBuilder extends BaseTabBuilder {

    public update: Subscription;
    public delete: Subscription;
    public finish: Subscription;

    constructor(id: number, state: string, public base: ExperimentTabBuilder) {
        super(base.tab);
        this.tab.data.sessionId = id;
        this.buildRoute(`fetch`)
        .buildRoute(`${id}`)
        .buildRoute(state);
    }
    
    build(): Tab {
        this.base.tab.sub = this.base
            .update.add(this.base.delete)
            .add(this.update)
            .add(this.delete)
            .add(this.finish);
        return this.base.tab;
    }

    buildUpdate(subject: Subject<Session>): TabBuilder {
        this.update = subject.subscribe((value) => {
            if (value.id === this.base.tab.data.sessionId) {
                const path = this.tab.route;
                const lastIndex = path.lastIndexOf('/');
                this.tab.route = path.slice(0, lastIndex + 1).concat(value.state);
                this.base.tabService.reopenTab(this.tab.route);
            }
        });
        return this;
    }

    buildDelete(subject: Subject<number>): TabBuilder {
        this.delete = subject.subscribe((value) => {
            if (value === this.base.tab.data.sessionId) {
                this.base.tabService.removeTab(this.base.tab.route);
            }
        });
        return this;
    }

    buildFinish(subject: Subject<number>): TabBuilder {
        this.finish = subject.subscribe((value) => {
            if (value === this.base.tab.data.sessionId) {
                const tab = this.base.tabFactory.create(['experiment', this.tab.data.id ]);
                this.base.tabService.replaceTab(this.tab.route, tab);
            }
        });
        return this;
    }

    buildClose(close: (id: number) => void): TabBuilder {
        this.base.tab.close = () => {
            close(this.tab.data.sessionId);
        };
        return this;
    }



}

