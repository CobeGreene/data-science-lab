import { NgZone, Injectable } from '@angular/core';
import { Messenger } from '../../services/messenger';
import { FetchEvents } from '../../../../shared/events';
import { FetchSessionService } from './fetch.session-service';

@Injectable()
export class AppFetchSessionService extends FetchSessionService {
    constructor(messenger: Messenger, zone: NgZone) {
                super(messenger, zone);
    }
    
    get eventCreate(): string {
        return FetchEvents.Create;
    }

    get eventUpdate(): string {
        return FetchEvents.Update;
    }

    get eventDelete(): string {
        return FetchEvents.Delete;
    }

    get eventFinish(): string {
        return FetchEvents.Finish; 
    }

    get eventSelect(): string {
        return FetchEvents.Select;
    }

    get eventOptions(): string {
        return FetchEvents.Options;
    }

    get eventCommand(): string {
        return FetchEvents.Command;
    }

    get eventInput(): string {
        throw new Error(`Fetch Session doesn't have an input event`);
    }

    get eventPrevious(): string {
        return FetchEvents.Previous;
    }
}

