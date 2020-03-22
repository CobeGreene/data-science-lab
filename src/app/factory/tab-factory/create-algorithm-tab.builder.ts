import { TabBuilder } from './tab.builder';
import { Tab } from '../../models';
import { BaseTabBuilder } from './base-tab.builder';
import { Subject, Subscription } from 'rxjs';
import { Session } from '../../../../shared/models';
import { DatasetTabBuilder } from './dataset-tab.builder';
import { ExperimentTabBuilder } from './experiment-tab.builder';

export class CreateAlgorithmTabBuilder extends BaseTabBuilder {

    public update: Subscription;
    public delete: Subscription;
    public finish: Subscription;

    get tabService() {
        return this.base.tabService;
    }

    get tabFactory() {
        return this.base.tabFactory;
    }

    constructor(id: number, state: string, public base: ExperimentTabBuilder) {
        super(base.tab);
        this.tab.data.sessionId = id;
        this.buildRoute(`create`)
            .buildRoute(`${id}`)
            .buildRoute(state);
    }

    build(): Tab {
        this.tab.sub = [this.base.delete, this.base.update, this.update, this.delete, this.finish];
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

    buildFinish(subject: Subject<{ id: number, returnPath?: string }>): TabBuilder {
        this.finish = subject.subscribe(({ id, returnPath }) => {
            if (id === this.tab.data.sessionId) {
                if (returnPath === undefined) {
                    const tab = this.tabFactory.create(['experiment', this.tab.data.id, 'algorithm']);
                    this.tabService.replaceTab(this.tab.route, tab);
                } else {
                    const tab = this.tabFactory.create(returnPath.split('/').slice(1));
                    this.tabService.replaceTab(this.tab.route, tab);
                }
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

