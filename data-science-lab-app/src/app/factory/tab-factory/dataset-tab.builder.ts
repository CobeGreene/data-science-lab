import { TabBuilder } from './tab.builder';
import { ExperimentTabBuilder } from './experiment-tab.builder';
import { Tab } from '../../models';
import { BaseTabBuilder } from './base-tab.builder';
import { Subject, Subscription } from 'rxjs';
import { Dataset } from '../../../../shared/models';

export class DatasetTabBuilder extends BaseTabBuilder {

    public update: Subscription;
    public delete: Subscription;

    get tabService() {
        return this.base.tabService;
    }

    get tabFactory() {
        return this.base.tabFactory;
    }

    get experiment() {
        return this.base;
    }

    constructor(id: number, name: string, public base: ExperimentTabBuilder) {
        super(base.tab);
        this.tab.data.datasetId = id;
        this.tab.name = name;
        this.buildRoute(`${id}`);
    }

    build(): Tab {
        this.experiment.update.unsubscribe();
        this.tab.sub = this.base.delete
            .add(this.update)
            .add(this.delete);
        return this.base.tab;
    }

    buildUpdate(subject: Subject<Dataset>): TabBuilder {
        this.update = subject.subscribe((value) => {
            if (value.id === this.tab.data.datasetId) {
                this.tab.name = `${this.tab.data.prefix}${value.name}`;
            }
        });
        return this;
    }

    buildDelete(subject: Subject<number>): TabBuilder {
        this.delete = subject.subscribe((id) => {
            if (id === this.tab.data.datasetId) {
                this.tabService.removeTab(this.base.tab.route);
            }
        });
        return this;
    }

    buildFinish(subject: Subject<any>): TabBuilder {
        throw new Error(`Dataset route does not have a finish`);
    }

    buildClose(_: (id: number) => void): TabBuilder {
        throw new Error(`Dataset route does not have a close`);
    }

}


