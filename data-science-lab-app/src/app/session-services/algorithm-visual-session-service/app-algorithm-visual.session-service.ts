import { NgZone, Injectable } from '@angular/core';
import { Messenger } from '../../services/messenger';
import { AlgorithmVisualsEvents } from '../../../../shared/events';
import { AlgorithmVisualSessionService } from './algorithm-visual.session-service';

@Injectable()
export class AppAlgorithmVisualSessionService extends AlgorithmVisualSessionService {
    constructor(messenger: Messenger, zone: NgZone) {
        super(messenger, zone);
    }

    get eventCreate(): string {
        return AlgorithmVisualsEvents.Create;
    }

    get eventUpdate(): string {
        return AlgorithmVisualsEvents.Update;
    }

    get eventDelete(): string {
        return AlgorithmVisualsEvents.Delete;
    }

    get eventFinish(): string {
        return AlgorithmVisualsEvents.Finish;
    }

    get eventSelect(): string {
        return AlgorithmVisualsEvents.Select;
    }

    get eventOptions(): string {
        return AlgorithmVisualsEvents.Options;
    }

    get eventCommand(): string {
        return AlgorithmVisualsEvents.Command;
    }

    get eventInput(): string {
        return AlgorithmVisualsEvents.Inputs;
    }

    get eventPrevious(): string {
        return AlgorithmVisualsEvents.Previous;
    }
}

