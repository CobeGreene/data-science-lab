import { Injectable, NgZone } from '@angular/core';
import { DatasetService } from './dataset.service';
import { Dataset } from '../../../../shared/models';
import { Messenger } from '../messenger';
import { DatasetEvents } from '../../../../shared/events';

@Injectable()
export class AppDatasetService extends DatasetService {
    private datasets: Dataset[];

    constructor(messenger: Messenger, zone: NgZone) {
        super(messenger, zone);

        this.datasets = [];
        this.registerEvents();
        this.messenger.publish(DatasetEvents.All);
    }

    registerEvents() {
        this.messenger.subscribe(DatasetEvents.All, this.allEvent);
        this.messenger.subscribe(DatasetEvents.Create, this.createEvent);
        this.messenger.subscribe(DatasetEvents.Delete, this.deleteEvent);
        this.messenger.subscribe(DatasetEvents.Update, this.updateEvent);
    }

    unregisterEvents() {
        this.messenger.unsubscribe(DatasetEvents.All, this.allEvent);
        this.messenger.unsubscribe(DatasetEvents.Create, this.createEvent);
        this.messenger.unsubscribe(DatasetEvents.Delete, this.deleteEvent);
        this.messenger.unsubscribe(DatasetEvents.Update, this.updateEvent);
    }

    private allEvent = (_event, datasets: Dataset[]) => {
        this.zone.run(() => {
            this.datasets = datasets;
            this.datasetsChanged.next(datasets);
        });
    }

    private createEvent = (_event, dataset: Dataset) => {
        this.zone.run(() => {
            const find = this.datasets.find(value => value.id === dataset.id);
            if (find === undefined) {
                this.datasets.push(dataset);
                this.datasetCreated.next(dataset);
                this.datasetsChanged.next(this.datasets);
            }
        });
    }

    private deleteEvent = (_event, id: number) => {
        this.zone.run(() => {
            const find = this.datasets.findIndex(value => value.id === id);
            if (find >= 0) {
                this.datasets.splice(find, 1);
                this.datasetDeleted.next(id);
                this.datasetsChanged.next(this.datasets);
            }
        });
    }

    private updateEvent = (_event, dataset: Dataset) => {
        this.zone.run(() => {
            const find = this.datasets.findIndex(value => value.id === dataset.id);
            if (find >= 0) {
                this.datasets.splice(find, 1, dataset);
                this.datasetUpdated.next(dataset);
            } else {
                this.datasets.push(dataset);
                this.datasetsChanged.next(this.datasets);
            }
        });
    }

    all(): Dataset[];
    // tslint:disable-next-line: unified-signatures
    all(experimentId: number): Dataset[];
    all(experimentId?: number): Dataset[] {
        if (experimentId === undefined) {
            return this.datasets;
        }
        return this.datasets.filter(value => value.experimentId === experimentId);
    }

    exists(id: number): boolean {
        return this.datasets.findIndex(value => value.id === id) >= 0;
    }

    get(id: number): Dataset {
        const find = this.datasets.find(value => value.id === id);
        if (find === undefined) {
            throw new Error(`Couldn't find dataset with id ${id}`);
        }
        return find;
    }

    delete(id: number): void {
        this.messenger.publish(DatasetEvents.Delete, id);
    }

    rename(id: number, name: string): void {
        this.messenger.publish(DatasetEvents.Rename, id, name);
    }

    split(id: number, split: number): void {
        this.messenger.publish(DatasetEvents.Split, id, split);
    }

    join(ids: number[]): void {
        this.messenger.publish(DatasetEvents.Join, ids);
    }

    show(id: number): void {
        this.messenger.publish(DatasetEvents.Show, id);
    }

    renameFeature(id: number, index: number, name: string): void {
        this.messenger.publish(DatasetEvents.RenameFeature, id, index, name);
    }
}




