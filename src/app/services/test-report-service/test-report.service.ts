import { Subject } from 'rxjs';
import { TestReport } from '../../../../shared/models';
import { Service } from '../service';
import { NgZone } from '@angular/core';
import { Messenger } from '../messenger';

export abstract class TestReportService extends Service {
    testReportsChanged: Subject<TestReport[]>;
    testReportUpdated: Subject<TestReport>;
    testReportCreated: Subject<TestReport>;
    testReportDeleted: Subject<number>;

    constructor(messenger: Messenger, zone: NgZone) {
        super(messenger, zone);

        this.testReportsChanged = new Subject<TestReport[]>();
        this.testReportUpdated = new Subject<TestReport>();
        this.testReportCreated = new Subject<TestReport>();
        this.testReportDeleted = new Subject<number>();
    }

    destorySubjects() {
        this.testReportsChanged.complete();
        this.testReportUpdated.complete();
        this.testReportCreated.complete();
        this.testReportDeleted.complete();
    }

    abstract all(): TestReport[];
    abstract all(algorithmId: number): TestReport[];
    abstract get(id: number): TestReport;
    abstract delete(id: number): void;
    abstract rename(id: number, name: string): void;
    abstract show(id: number): void;
}

