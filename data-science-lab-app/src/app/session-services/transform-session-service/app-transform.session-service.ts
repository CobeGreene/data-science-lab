import { NgZone, Injectable } from '@angular/core';
import { Messenger } from '../../services/messenger';
import { TransformEvents } from '../../../../shared/events';
import { TransformSessionService } from './transform.session-service';

@Injectable()
export class AppTransformSessionService extends TransformSessionService {
    constructor(messenger: Messenger, zone: NgZone) {
        super(messenger, zone);
    }

    get eventCreate(): string {
        return TransformEvents.Create;
    }

    get eventUpdate(): string {
        return TransformEvents.Update;
    }

    get eventDelete(): string {
        return TransformEvents.Delete;
    }

    get eventFinish(): string {
        return TransformEvents.Finish;
    }

    get eventSelect(): string {
        return TransformEvents.Select;
    }

    get eventOptions(): string {
        return TransformEvents.Options;
    }

    get eventCommand(): string {
        return TransformEvents.Command;
    }

    get eventInput(): string {
        return TransformEvents.Inputs;
    }

    get eventPrevious(): string {
        return TransformEvents.Previous;
    }
}

