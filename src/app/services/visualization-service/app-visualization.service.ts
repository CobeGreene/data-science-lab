import { Injectable, NgZone } from '@angular/core';
import { VisualizationService } from './visualization.service';
import { Visual } from '../../../../shared/models';
import { Messenger } from '../messenger';
import { VisualEvents } from '../../../../shared/events';

@Injectable()
export class AppVisualizationService extends VisualizationService {
    private visuals: Visual[];

    constructor(messenger: Messenger, zone: NgZone) {
        super(messenger, zone);

        this.visuals = [];
        this.registerEvents();
        this.messenger.publish(VisualEvents.All);
    }

    registerEvents() {
        this.messenger.subscribe(VisualEvents.All, this.allEvent);
        this.messenger.subscribe(VisualEvents.Create, this.createEvent);
        this.messenger.subscribe(VisualEvents.Delete, this.deleteEvent);
        this.messenger.subscribe(VisualEvents.Update, this.updateEvent);
    }

    unregisterEvents() {
        this.messenger.unsubscribe(VisualEvents.All, this.allEvent);
        this.messenger.unsubscribe(VisualEvents.Create, this.createEvent);
        this.messenger.unsubscribe(VisualEvents.Delete, this.deleteEvent);
        this.messenger.unsubscribe(VisualEvents.Update, this.updateEvent);
    }

    private allEvent = (_event, visuals: Visual[]) => {
        this.zone.run(() => {
            this.visuals = visuals;
            this.visualsChanged.next(this.visuals);
        });
    }

    private createEvent = (_event, visual: Visual) => {
        this.zone.run(() => {
            const find = this.visuals.find(value => value.id === visual.id);
            if (find === undefined) {
                this.visuals.push(visual);
                this.visualCreated.next(visual);
                this.visualsChanged.next(this.visuals);
            }
        });
    }

    private deleteEvent = (_event, id: number) => {
        this.zone.run(() => {
            const find = this.visuals.findIndex(value => value.id === id);
            if (find >= 0) {
                this.visuals.splice(find, 1);
                this.visualDeleted.next(id);
                this.visualsChanged.next(this.visuals);
            }
        });
    }

    private updateEvent = (_event, visual: Visual) => {
        this.zone.run(() => {
            const find = this.visuals.findIndex(value => value.id === visual.id);
            if (find >= 0) {
                this.visuals.splice(find, 1, visual);
                this.visualUpdated.next(visual);
            } else {
                this.visuals.push(visual);
                this.visualsChanged.next(this.visuals);
            }
        });
    }

    all(): Visual[];
    all(experimentId: number): Visual[];
    // tslint:disable-next-line: unified-signatures
    all(experimentId?: number): Visual[] {
        if (experimentId === undefined) {
            return this.visuals;
        }
        return this.visuals.filter(value => value.experimentId === experimentId);
    }

    get(id: number) {
        const find = this.visuals.find(value => value.id === id);
        if (find === undefined) {
            throw new Error(`Couldn't find visual with id ${id}`);
        }
        return find;
    }

    delete(id: number): void {
        this.messenger.publish(VisualEvents.Delete, id);
    }

    resize(id: number, width: number, height: number): void {
        this.messenger.publish(VisualEvents.Resize, id, width, height);
    }
    
    reposition(id: number, top: number, left: number): void {
        this.messenger.publish(VisualEvents.Reposition, id, top, left);
    }

    show(id: number): void {
        this.messenger.publish(VisualEvents.Show, id);
    }

    rename(id: number, name: string) {
        this.messenger.publish(VisualEvents.Rename, id, name);
    }

}

