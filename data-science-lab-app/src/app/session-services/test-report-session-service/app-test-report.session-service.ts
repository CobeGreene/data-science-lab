import { TestReportSession } from '../../../../shared/models';
import { Messenger } from '../../services/messenger';
import { NgZone } from '@angular/core';
import { TestReportSessionService } from './test-report.session-service';
import { TestReportCreateEvents } from '../../../../shared/events';


export class AppTestReportSessionService extends TestReportSessionService {

    sessions: TestReportSession[];

    constructor(messenger: Messenger, zone: NgZone) {
        super(messenger, zone);

        this.sessions = [];
        this.registerEvents();
    }

    registerEvents() {
        this.messenger.subscribe(TestReportCreateEvents.Create, this.createEvent);
        this.messenger.subscribe(TestReportCreateEvents.Delete, this.deleteEvent);
        this.messenger.subscribe(TestReportCreateEvents.Update, this.updateEvent);
        this.messenger.subscribe(TestReportCreateEvents.Finish, this.finishEvent);
    }

    unregisterEvents() {
        this.messenger.unsubscribe(TestReportCreateEvents.Create, this.createEvent);
        this.messenger.unsubscribe(TestReportCreateEvents.Delete, this.deleteEvent);
        this.messenger.unsubscribe(TestReportCreateEvents.Update, this.updateEvent);
        this.messenger.unsubscribe(TestReportCreateEvents.Finish, this.finishEvent);
    }

    private createEvent = (_event, session: TestReportSession) => {
        this.zone.run(() => {
            const find = this.sessions.find(value => value.id === session.id);
            if (find === undefined) {
                this.sessions.push(session);
                this.sessionCreated.next(session.id);
            }
        });
    }

    private deleteEvent = (_event, id: number) => {
        this.zone.run(() => {
            const find = this.sessions.findIndex(value => value.id === id);
            if (find >= 0) {
                this.sessions.splice(find, 1);
                this.sessionDeleted.next(id);
            }
        });
    }

    private updateEvent = (_event, session: TestReportSession) => {
        this.zone.run(() => {
            const find = this.sessions.findIndex(value => value.id === session.id);
            if (find >= 0) {
                this.sessions.splice(find, 1, session);
            } else {
                this.sessions.push(session);
            }
            this.sessionUpdated.next(session);
        });
    }

    private finishEvent = (_event, id: number, returnPath?: string) => {
        this.zone.run(() => {
            const find = this.sessions.findIndex(value => value.id === id);
            if (find >= 0) {
                this.sessions.splice(find, 1);
                this.sessionFinished.next({ id, returnPath });
            }
        });
    }

    create(algorithmId: number): void {
        this.messenger.publish(TestReportCreateEvents.Create, algorithmId);
    }

    get(id: number): TestReportSession {
        const find = this.sessions.findIndex(value => value.id === id);
        if (find >= 0) {
            return this.sessions[find];
        }
        throw new Error(`Couldn't find session with id ${id}`);
    }

    delete(id: number): void {
        this.messenger.publish(TestReportCreateEvents.Delete, id);
    }

    attemptDelete = (id: number): void => {
        const find = this.sessions.find(value => value.id === id);
        if (find) {
            this.messenger.publish(TestReportCreateEvents.Delete, id);
        }
    }

    select(id: number, datasetId: number, selectedFeatures: number[]): void {
        this.messenger.publish(TestReportCreateEvents.Select, id, datasetId, selectedFeatures);
    }

    inputDictionary(id: number, inputDict: { [id: string]: number[]; }) {
        this.messenger.publish(TestReportCreateEvents.Inputs, id, inputDict);
    }

    previous(id: number): void {
        this.messenger.publish(TestReportCreateEvents.Previous, id);
    }

}
