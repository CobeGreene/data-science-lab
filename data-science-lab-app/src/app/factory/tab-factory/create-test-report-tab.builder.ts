import { TabBuilder } from './tab.builder';
import { AlgorithmTabBuilder } from './algorithm-tab.builder';
import { Tab } from '../../models';
import { BaseTabBuilder } from './base-tab.builder';
import { Subject, Subscription } from 'rxjs';
import { TestReportSession } from '../../../../shared/models';

export class CreateTestReportTabBuilder extends BaseTabBuilder {
    public update: Subscription;
    public delete: Subscription;
    public finish: Subscription;
    
    get tabService() {
        return this.base.tabService;
    }

    get tabFactory() {
        return this.base.tabFactory;
    }

    constructor(id: number, state: string, public base: AlgorithmTabBuilder) {
        super(base.tab);

        this.tab.data.sessionId = id;
        this.buildRoute('test')
            .buildRoute(`${id}`)
            .buildRoute(state);
    }

    build(): Tab {
        this.base.experiment.update.unsubscribe();
        this.tab.sub = [this.base.experiment.delete, this.base.delete, this.base.update, this.update, this.delete, this.finish];
        return this.tab;
    }

    buildUpdate(subject: Subject<TestReportSession>): TabBuilder {
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
                    const tab = this.tabFactory.create(['experiment', this.tab.data.id, 'algorithm', this.tab.data.algorithmId]);
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
