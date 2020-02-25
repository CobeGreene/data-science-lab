import { Service } from '../services/service';
import { Messenger } from '../services/messenger';
import { NgZone } from '@angular/core';
import { Subject } from 'rxjs';
import { SessionOptions, Plugin, Session, SessionPlugin } from '../../../shared/models';

export abstract class SessionService extends Service {
    public sessionCreated: Subject<number>;
    public sessionUpdated: Subject<Session>;
    public sessionDeleted: Subject<number>;
    public sessionFinished: Subject<number>;

    sessions: Session[];

    constructor(messenger: Messenger, zone: NgZone) {
        super(messenger, zone);

        this.sessionCreated = new Subject<number>();
        this.sessionUpdated = new Subject<Session>();
        this.sessionDeleted = new Subject<number>();
        this.sessionFinished = new Subject<number>();

        this.sessions = [];
        this.registerEvents();
    }

    destorySubjects() {
        this.sessionCreated.complete();
        this.sessionUpdated.complete();
        this.sessionDeleted.complete();
        this.sessionFinished.complete();
    }

    registerEvents() {
        this.messenger.subscribe(this.eventCreate, this.createEvent);
        this.messenger.subscribe(this.eventDelete, this.deleteEvent);
        this.messenger.subscribe(this.eventUpdate, this.updateEvent);
        this.messenger.subscribe(this.eventFinish, this.finishEvent);
    }

    unregisterEvents() {
        this.messenger.unsubscribe(this.eventCreate, this.createEvent);
        this.messenger.unsubscribe(this.eventDelete, this.deleteEvent);
        this.messenger.unsubscribe(this.eventUpdate, this.updateEvent);
        this.messenger.unsubscribe(this.eventFinish, this.finishEvent);
    }

    private createEvent = (_event, session: Session) => {
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

    private updateEvent = (_event, session: Session) => {
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

    private finishEvent = (_event, id: number) => {
        this.zone.run(() => {
            const find = this.sessions.findIndex(value => value.id === id);
            if (find >= 0) {
                this.sessions.splice(find, 1);
                this.sessionFinished.next(id);
            }
        });
    }

    abstract get eventCreate(): string;
    abstract get eventUpdate(): string;
    abstract get eventDelete(): string;
    abstract get eventFinish(): string;
    abstract get eventSelect(): string;
    abstract get eventOptions(): string;
    abstract get eventCommand(): string;
    abstract get eventInput(): string;
    abstract get eventPrevious(): string;

    create(keyId: number, options: SessionOptions);
    // tslint:disable-next-line: unified-signatures
    create(keyId: number, options: SessionOptions, features: number[]);
    // tslint:disable-next-line: unified-signatures
    create(keyId: number, options: SessionOptions, features: number[], returnPath: string);
    create(keyId: number, options: SessionOptions, features?: number[], returnPath?: string) {
        this.messenger.publish(this.eventCreate, keyId, options, features, returnPath);
    }

    get(id: number): Session {
        const find = this.sessions.findIndex(value => value.id === id);
        if (find >= 0) {
            return this.sessions[find];
        }
        throw new Error(`Couldn't find session with id ${id}`);
    }

    delete(id: number): void {
        this.messenger.publish(this.eventDelete, id);
    }

    attemptDelete(id: number): void {
        const find = this.sessions.find(value => value.id === id);
        if (find) {
            this.messenger.publish(this.eventDelete, id);
        }
    }

    select(id: number, plugin: Plugin | SessionPlugin): void {
        this.messenger.publish(this.eventSelect, id, plugin);
    }

    inputOptions(id: number, inputs: { [id: string]: any; }): void {
        this.messenger.publish(this.eventOptions, id, inputs);
    }

    inputDictionary(id: number, inputDict: { [id: string]: number[]; }) {
        this.messenger.publish(this.eventInput, id, inputDict);
    }

    executeCommand(id: number, command: string) {
        this.messenger.publish(this.eventCommand, id, command);
    }

    previous(id: number) {
        this.messenger.publish(this.eventPrevious, id);
    }

}

