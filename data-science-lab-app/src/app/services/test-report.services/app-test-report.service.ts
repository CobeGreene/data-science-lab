import { TestReportService } from './test-report.service';
import { Injectable, NgZone } from '@angular/core';
import { TestReportViewModel, TestingSessionViewModel } from '../../../../shared/view-models';
import { IpcService } from '../../../../shared/services';
import { ExperimentsEvents } from '../../../../shared/events';

@Injectable()
export class AppTestReportService extends TestReportService {

    private reports: TestReportViewModel[];

    constructor(private ipcService: IpcService, private zone: NgZone) {
        super();

        this.reports = [];
        this.registerEvents();
        this.ipcService.send(ExperimentsEvents.GetAllTestReportEvent);
    }

    registerEvents() {
        this.ipcService.on(ExperimentsEvents.GetAllTestReportListeners, this.getAllEvent);
        this.ipcService.on(ExperimentsEvents.NewTestReportListeners, this.newEvent);
        this.ipcService.on(ExperimentsEvents.LoadExperimentListener, this.loadEvent);
    }

    loadEvent = () => {
        this.ipcService.send(ExperimentsEvents.GetAllTestReportEvent);
    }

    getAllEvent = (event, reports: TestReportViewModel[]) => {
        this.zone.run(() => {
            this.reports = reports;
            this.testReportsChanged.next(reports);
        });
    }

    newEvent = (event, report: TestReportViewModel) => {
        this.zone.run(() => {
            const find = this.reports.find((value) => {
                return value.id === report.id;
            });
            if (find === undefined) {
                this.reports.push(report);
                this.testReportsChanged.next(this.reports);
            }
        });
    }

    all(algorithmId: number): TestReportViewModel[] {
        return this.reports.filter((value) => {
            return value.algorithmId === algorithmId;
        });
    }

    get(id: number): TestReportViewModel {
        const find = this.reports.find((value) => {
            return value.id === id;
        });
        if (find) {
            return find;
        }
        throw new Error(`Couldn't find report with id ${id}`);
    }

    
}
