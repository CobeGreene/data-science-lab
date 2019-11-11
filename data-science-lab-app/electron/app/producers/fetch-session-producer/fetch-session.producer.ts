import { Producer } from '../producer';
import { FetchSession } from '../../models';

export interface FetchSessionProducer extends Producer {

    all(fetchSessions: FetchSession[]);
    newSession(fetchSession: FetchSession);
}
