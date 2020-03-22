import { TestReportSession, SessionOptions } from '../../../../shared/models';
import { Subject } from 'rxjs';
import { Messenger } from '../../services/messenger';
import { NgZone } from '@angular/core';
import { Service } from '../../services/service';

export abstract class TestReportSessionService extends Service {
    public sessionCreated: Subject<number>;
    public sessionUpdated: Subject<TestReportSession>;
    public sessionDeleted: Subject<number>;
    public sessionFinished: Subject<{ id: number, returnPath?: string }>;

    constructor(messenger: Messenger, zone: NgZone) {
        super(messenger, zone);

        this.sessionCreated = new Subject<number>();
        this.sessionUpdated = new Subject<TestReportSession>();
        this.sessionDeleted = new Subject<number>();
        this.sessionFinished = new Subject<{ id: number, returnPath?: string }>();
    }

    destorySubjects() {
        this.sessionCreated.complete();
        this.sessionUpdated.complete();
        this.sessionDeleted.complete();
        this.sessionFinished.complete();
    }

    abstract create(algorithmId: number, options: SessionOptions, returnPath?: string): void;
    abstract get(id: number): TestReportSession;
    abstract delete(id: number): void;
    abstract attemptDelete(id: number): void;
    abstract select(id: number, datasetId: number, selectedFeatures: number[]): void;
    abstract inputDictionary(id: number, inputDict: { [id: string]: number[]; });
    abstract previous(id: number): void;
} 
