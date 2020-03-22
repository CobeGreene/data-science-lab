import { NgZone, Injectable } from '@angular/core';
import { Messenger } from '../../services/messenger';
import { AlgorithmCreateEvents } from '../../../../shared/events';
import { AlgorithmSessionService } from './algorithm.session-service';


@Injectable()
export class AppAlgorithmSessionService extends AlgorithmSessionService {
    constructor(messenger: Messenger, zone: NgZone) {
        super(messenger, zone);
    }

    get eventCreate(): string {
        return AlgorithmCreateEvents.Create;
    }

    get eventUpdate(): string {
        return AlgorithmCreateEvents.Update;
    }

    get eventDelete(): string {
        return AlgorithmCreateEvents.Delete;
    }

    get eventFinish(): string {
        return AlgorithmCreateEvents.Finish; 
    }

    get eventSelect(): string {
        return AlgorithmCreateEvents.Select;
    }

    get eventOptions(): string {
        return AlgorithmCreateEvents.Options;
    }

    get eventCommand(): string {
        return AlgorithmCreateEvents.Command;
    }

    get eventInput(): string {
        return AlgorithmCreateEvents.Inputs;
    }

    get eventPrevious(): string {
        return AlgorithmCreateEvents.Previous;
    }
}

