import { Producer } from '../producer';
import { TransformSession, ExperimentDataGroup, DataGroupSettings } from '../../models';


export interface TransformSessionProducer extends Producer {

    all(sessions: TransformSession[]): void;
    newSession(session: TransformSession): void;
    delete(dataGroupId: number): void;
    updateSession(session: TransformSession): void;
    updateDataGroup(dataGroup: ExperimentDataGroup, setings: DataGroupSettings);
    newDataGroup(dataGroup: ExperimentDataGroup, setings: DataGroupSettings);
    finish(dataGroupId: number): void;

}


