import { NgZone, Injectable } from '@angular/core';
import { Messenger } from '../../services/messenger';
import { DatasetVisualsEvents } from '../../../../shared/events';
import { DatasetVisualSessionService } from './dataset-visual.session-service';

@Injectable()
export class AppDatasetVisualSessionService extends DatasetVisualSessionService {
    constructor(messenger: Messenger, zone: NgZone) {
        super(messenger, zone);
    }

    get eventCreate(): string {
        return DatasetVisualsEvents.Create;
    }

    get eventUpdate(): string {
        return DatasetVisualsEvents.Update;
    }

    get eventDelete(): string {
        return DatasetVisualsEvents.Delete;
    }

    get eventFinish(): string {
        return DatasetVisualsEvents.Finish;
    }

    get eventSelect(): string {
        return DatasetVisualsEvents.Select;
    }

    get eventOptions(): string {
        return DatasetVisualsEvents.Options;
    }

    get eventCommand(): string {
        return DatasetVisualsEvents.Command;
    }

    get eventInput(): string {
        return DatasetVisualsEvents.Inputs;
    }

    get eventPrevious(): string {
        return DatasetVisualsEvents.Previous;
    }
}

