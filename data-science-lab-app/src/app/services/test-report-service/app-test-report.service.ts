import { TestReport } from '../../../../shared/models';
import { TestReportEvents } from '../../../../shared/events';
import { NgZone, Injectable } from '@angular/core';
import { Messenger } from '../messenger';
import { TestReportService } from './test-report.service';

@Injectable()
export class AppTestReportService extends TestReportService {

    reports: TestReport[];

    constructor(messenger: Messenger, zone: NgZone) {
        super(messenger, zone);

        this.reports = [];
        this.registerEvents();
        this.messenger.publish(TestReportEvents.All);
    }

    registerEvents() {
        this.messenger.subscribe(TestReportEvents.All, this.allEvent);
        this.messenger.subscribe(TestReportEvents.Create, this.createEvent);
        this.messenger.subscribe(TestReportEvents.Delete, this.deleteEvent);
        this.messenger.subscribe(TestReportEvents.Update, this.updateEvent);
    }

    unregisterEvents() {
        this.messenger.unsubscribe(TestReportEvents.All, this.allEvent);
        this.messenger.unsubscribe(TestReportEvents.Create, this.createEvent);
        this.messenger.unsubscribe(TestReportEvents.Delete, this.deleteEvent);
        this.messenger.unsubscribe(TestReportEvents.Update, this.updateEvent);
    }

    private allEvent = (_event, reports: TestReport[]) => {
        this.zone.run(() => {
            this.reports = reports;
            this.testReportsChanged.next(this.reports);
        });
    }

    private createEvent = (_event, report: TestReport) => {
        this.zone.run(() => {
            const find = this.reports.find(value => value.id === report.id);
            if (find === undefined) {
                this.reports.push(report);
                this.testReportCreated.next(report);
                this.testReportsChanged.next(this.reports);
            }
        });
    }

    private deleteEvent = (_event, id: number) => {
        this.zone.run(() => {
            const find = this.reports.findIndex(value => value.id === id);
            if (find >= 0) {
                this.reports.splice(find, 1);
                this.testReportDeleted.next(id);
                this.testReportsChanged.next(this.reports);
            }
        });
    }

    private updateEvent = (_event, report: TestReport) => {
        this.zone.run(() => {
            const find = this.reports.findIndex(value => value.id === report.id);
            if (find >= 0) {
                this.reports.splice(find, 1, report);
                this.testReportUpdated.next(report);
            } else {
                this.reports.push(report);
                this.testReportsChanged.next(this.reports);
            }
        });
    }


    all(algorithmId?: number): TestReport[] {
        if (algorithmId === undefined) {
            return this.reports;
        }
        return this.reports.filter(value => value.algorithmId === algorithmId);
    }

    get(id: number): TestReport {
        const report = this.reports.find(value => value.id === id);
        if (report === undefined) {
            throw new Error(`Couldn't find report with id ${id}`);
        }
        return report;
    }

    delete(id: number): void {
        this.messenger.publish(TestReportEvents.Delete, id);
    }

    rename(id: number, name: string): void {
        this.messenger.publish(TestReportEvents.Rename, id, name);
    }
}

