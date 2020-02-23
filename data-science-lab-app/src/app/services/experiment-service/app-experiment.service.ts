import { Injectable, NgZone } from '@angular/core';
import { ExperimentService } from './experiment.service';
import { Experiment, ExperimentState } from '../../../../shared/models';
import { Messenger } from '../messenger';
import { ExperimentEvents } from '../../../../shared/events';


@Injectable()
export class AppExperimentService extends ExperimentService {

    private experiments: Experiment[];

    constructor(messeger: Messenger, zone: NgZone) {
        super(messeger, zone);

        this.experiments = [];
        this.registerEvents();
        this.messenger.publish(ExperimentEvents.All);
    }

    registerEvents() {
        this.messenger.subscribe(ExperimentEvents.All, this.allEvent);
        this.messenger.subscribe(ExperimentEvents.Create, this.createEvent);
        this.messenger.subscribe(ExperimentEvents.Delete, this.deleteEvent);
        this.messenger.subscribe(ExperimentEvents.Update, this.updateEvent);
        this.messenger.subscribe(ExperimentEvents.Load, this.loadEvent);
    }
    
    unregisterEvents() {
        this.messenger.unsubscribe(ExperimentEvents.All, this.allEvent);
        this.messenger.unsubscribe(ExperimentEvents.Create, this.createEvent);
        this.messenger.unsubscribe(ExperimentEvents.Delete, this.deleteEvent);
        this.messenger.unsubscribe(ExperimentEvents.Update, this.updateEvent);
        this.messenger.unsubscribe(ExperimentEvents.Load, this.loadEvent);
    }

    private allEvent = (_event, experiments: Experiment[]) => {
        this.zone.run(() => {
            this.experiments = experiments;
            this.experimentsChanged.next(this.experiments);
        });
    }

    private createEvent = (_event, experiment: Experiment) => {
        this.zone.run(() => {
            const find = this.experiments.find(value => value.id === experiment.id);
            if (find === undefined) {
                this.experiments.push(experiment);
                this.experimentCreated.next(experiment);
                this.experimentsChanged.next(this.experiments);
            }
        });
    }

    private loadEvent = (_event, experiment: Experiment) => {
        this.zone.run(() => {
            const find = this.experiments.findIndex(value => value.id === experiment.id);
            if (find >= 0) {
                this.experiments.splice(find, 1, experiment);
                this.experimentLoaded.next(experiment);
            } else {
                this.experiments.push(experiment);
                this.experimentLoaded.next(experiment);
                this.experimentsChanged.next(this.experiments);
            }
        });
    }

    private deleteEvent = (_event, id: number) => {
        this.zone.run(() => {
            const find = this.experiments.findIndex(value => value.id === id);
            if (find >= 0) {
                this.experiments.splice(find, 1);
                this.experimentDeleted.next(id);
                this.experimentsChanged.next(this.experiments);
            }
        });
    }

    private updateEvent = (_event, experiment: Experiment) => {
        this.zone.run(() => {
            const find = this.experiments.findIndex(value => value.id === experiment.id);
            if (find >= 0) {
                this.experiments.splice(find, 1, experiment);
                this.experimentUpdated.next(experiment);
            } else {
                this.experiments.push(experiment);
                this.experimentsChanged.next(this.experiments);
            }
        });
    }

    all(): Experiment[] {
        return this.experiments;
    }    
    
    create(title: string, description?: string): void {
        this.messenger.publish(ExperimentEvents.Create, title, description);
    }
    
    get(id: number): Experiment {
        const find = this.experiments.find(value => value.id === id);
        if (find === undefined) {
            throw new Error(`Couldn't find experiment with id ${id}.`);
        }
        return find;
    }
    
    update(id: number, title: string, description?: string): void {
        this.messenger.publish(ExperimentEvents.Update, id, title, description);
    }
    
    delete(id: number): void {
        this.messenger.publish(ExperimentEvents.Delete, id);
    }

    load(id: number): void {
        this.messenger.publish(ExperimentEvents.Load, id);
    }
    


}

