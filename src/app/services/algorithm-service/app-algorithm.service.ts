import { NgZone, Injectable } from '@angular/core';
import { AlgorithmService } from './algorithm.service';
import { Algorithm } from '../../../../shared/models';
import { Messenger } from '../messenger';
import { AlgorithmEvents } from '../../../../shared/events';


@Injectable()
export class AppAlgorithmService extends AlgorithmService {
    private algorithms: Algorithm[];

    constructor(messenger: Messenger, zone: NgZone) {
        super(messenger, zone)/* istanbul ignore next */;

        this.algorithms = [];
        this.registerEvents();
        this.messenger.publish(AlgorithmEvents.All);
    }

    registerEvents() {
        this.messenger.subscribe(AlgorithmEvents.All, this.allEvent);
        this.messenger.subscribe(AlgorithmEvents.Create, this.createEvent);
        this.messenger.subscribe(AlgorithmEvents.Delete, this.deleteEvent);
        this.messenger.subscribe(AlgorithmEvents.Update, this.updateEvent);
    }

    unregisterEvents() {
        this.messenger.unsubscribe(AlgorithmEvents.All, this.allEvent);
        this.messenger.unsubscribe(AlgorithmEvents.Create, this.createEvent);
        this.messenger.unsubscribe(AlgorithmEvents.Delete, this.deleteEvent);
        this.messenger.unsubscribe(AlgorithmEvents.Update, this.updateEvent);
    }

    private allEvent = (_event, algorithms: Algorithm[]) => {
        this.zone.run(() => {
            this.algorithms = algorithms;
            this.algorithmsChanged.next(this.algorithms);
        });
    }

    private createEvent = (_event, algorithm: Algorithm) => {
        this.zone.run(() => {
            const find = this.algorithms.find(value => value.id === algorithm.id);
            if (find === undefined) {
                this.algorithms.push(algorithm);
                this.algorithmCreated.next(algorithm);
                this.algorithmsChanged.next(this.algorithms);
            }
        });
    }

    private deleteEvent = (_event, id: number) => {
        this.zone.run(() => {
            const find = this.algorithms.findIndex(value => value.id === id);
            if (find >= 0) {
                this.algorithms.splice(find, 1);
                this.algorithmDeleted.next(id);
                this.algorithmsChanged.next(this.algorithms);
            }
        });
    }

    private updateEvent = (_event, algorithm: Algorithm) => {
        this.zone.run(() => {
            const find = this.algorithms.findIndex(value => value.id === algorithm.id);
            if (find >= 0) {
                this.algorithms.splice(find, 1, algorithm);
                this.algorithmUpdated.next(algorithm);
            } else {
                this.algorithms.push(algorithm);
                this.algorithmsChanged.next(this.algorithms);
            }
        });
    }

    all(): Algorithm[];
    // tslint:disable-next-line: unified-signatures
    all(experimentId: number): Algorithm[];
    all(experimentId?: number): Algorithm[] {
        if (experimentId === undefined) {
            return this.algorithms;
        }
        return this.algorithms.filter(value => value.experimentId === experimentId);
    }

    get(id: number): Algorithm {
        const find = this.algorithms.find(value => value.id === id);
        if (find === undefined) {
            throw new Error(`Couldn't find algorithm with id ${id}`);
        }
        return find;
    }

    delete(id: number): void {
        this.messenger.publish(AlgorithmEvents.Delete, id);
    }

    update(id: number, name: string, time: number): void {
        this.messenger.publish(AlgorithmEvents.Update, id, name, time);
    }

    start(id: number) {
        this.messenger.publish(AlgorithmEvents.Start, id);
    }

    stop(id: number) {
        this.messenger.publish(AlgorithmEvents.Stop, id);
    }

    export(id: number, language: string) {
        this.messenger.publish(AlgorithmEvents.Export, id, language);
    }

}

