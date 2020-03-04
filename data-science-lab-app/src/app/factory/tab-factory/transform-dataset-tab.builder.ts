import { TabBuilder } from './tab.builder';
import { Tab } from '../../models';
import { BaseTabBuilder } from './base-tab.builder';
import { Subject, Subscription } from 'rxjs';
import { Session } from '../../../../shared/models';
import { DatasetTabBuilder } from './dataset-tab.builder';

export class TransformDatasetTabBuilder extends BaseTabBuilder {

    public update: Subscription;
    public delete: Subscription;
    public finish: Subscription;

    get tabService() {
        return this.base.tabService;
    }

    get tabFactory() {
        return this.base.tabFactory;
    }

    constructor(id: number, state: string, public base: DatasetTabBuilder) {
        super(base.tab);
        this.tab.data.sessionId = id;
        this.buildRoute(`transform`)
            .buildRoute(`${id}`)
            .buildRoute(state);
    }

    build(): Tab {
        this.base.experiment.update.unsubscribe();
        this.tab.sub = this.base.experiment.delete
            .add(this.base.update)
            .add(this.base.delete)
            .add(this.update)
            .add(this.delete)
            .add(this.finish);
        return this.tab;
    }

    buildUpdate(subject: Subject<Session>): TabBuilder {
        this.update = subject.subscribe((value) => {
            if (value.id === this.tab.data.sessionId) {
                const path = this.tab.route;
                const lastIndex = path.lastIndexOf('/');
                this.tab.route = path.slice(0, lastIndex + 1).concat(value.state);
                this.tabService.reopenTab(this.tab.route);
            }
        });
        return this;
    }

    buildDelete(subject: Subject<number>): TabBuilder {
        this.delete = subject.subscribe((value) => {
            if (value === this.tab.data.sessionId) {
                this.tabService.removeTab(this.tab.route);
            }
        });
        return this;
    }

    buildFinish(subject: Subject<number>): TabBuilder {
        this.finish = subject.subscribe((value) => {
            if (value === this.tab.data.sessionId) {
                const tab = this.tabFactory.create(['experiment', this.tab.data.id]);
                this.tabService.replaceTab(this.tab.route, tab);
            }
        });
        return this;
    }

    buildClose(close: (id: number) => void): TabBuilder {
        this.tab.close = () => {
            close(this.tab.data.sessionId);
        };
        return this;
    }

}

