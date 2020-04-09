import { NgZone, Injectable } from '@angular/core';
import { Messenger } from '../../services/messenger';
import { TestReportVisualsEvents } from '../../../../shared/events';
import { TestReportVisualSessionService } from './test-report-visual.session-service';

@Injectable()
export class AppTestReportVisualSessionService extends TestReportVisualSessionService {
    constructor(messenger: Messenger, zone: NgZone) {
        super(messenger, zone);
    }

    get eventCreate(): string {
        return TestReportVisualsEvents.Create;
    }

    get eventUpdate(): string {
        return TestReportVisualsEvents.Update;
    }

    get eventDelete(): string {
        return TestReportVisualsEvents.Delete;
    }

    get eventFinish(): string {
        return TestReportVisualsEvents.Finish;
    }

    get eventSelect(): string {
        return TestReportVisualsEvents.Select;
    }

    get eventOptions(): string {
        return TestReportVisualsEvents.Options;
    }

    get eventCommand(): string {
        return TestReportVisualsEvents.Command;
    }

    get eventInput(): string {
        return TestReportVisualsEvents.Inputs;
    }

    get eventPrevious(): string {
        return TestReportVisualsEvents.Previous;
    }
}

