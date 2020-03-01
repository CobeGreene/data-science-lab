import { Tab } from '../../models';
import { TabService } from '../../services/tab-service';
import { TabFactory } from './tab.factory';
import { Subject, Subscription } from 'rxjs';
import { Experiment } from '../../../../shared/models';
import { BaseTabBuilder } from './base-tab.builder';

export class ExperimentTabBuilder extends BaseTabBuilder {
    public update: Subscription;
    public delete: Subscription;

    constructor(id: number, title: string, public tabService: TabService, public tabFactory: TabFactory) {
        super({
            name: title,
            route: `/experiment/${id}`,
            data: {
                id,
                prefix: '',
            }
        });
    }

    build(): Tab {
        this.tab.sub = this.update.add(this.delete);
        return this.tab;
    }

    buildUpdate(subject: Subject<Experiment>): ExperimentTabBuilder {
        this.update = subject.subscribe((experiment) => {
            if (experiment.id === this.tab.data.id) {
                this.tab.name = `${this.tab.data.prefix}${experiment.title}`;
            }
        });
        return this;
    }

    buildDelete(subject: Subject<number>): ExperimentTabBuilder {
        this.delete = subject.subscribe((id) => {
            if (id === this.tab.data.id) {
                this.tabService.removeTab(this.tab.route);
            }
        });
        return this;
    }

    buildFinish(subject: Subject<any>): ExperimentTabBuilder {
        throw new Error(`Experiment route does not have a finish`);
    }

    buildClose(_: (id: number) => void): ExperimentTabBuilder {
        throw new Error(`Experiment route does not have a close`);
    }
}

