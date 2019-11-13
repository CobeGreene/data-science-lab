import { Producer } from '../producer';
import { FetchSession, ExperimentDataGroup, DataGroupSettings } from '../../models';

export interface FetchSessionProducer extends Producer {

    all(fetchSessions: FetchSession[]);
    newSession(fetchSession: FetchSession);
    delete(experimentId: number);
    updateSession(fetchSession: FetchSession);
    newDataGroup(dataGroup: ExperimentDataGroup, settings: DataGroupSettings);
    finish(experimentId: number);
}
