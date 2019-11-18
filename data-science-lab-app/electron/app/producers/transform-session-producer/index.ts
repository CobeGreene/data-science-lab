import { TransformSessionProducer } from './transform-session.producer';
import { Producer } from '../producer';
import { TransformSession, ExperimentDataGroup, DataGroupSettings } from '../../models';
import { BaseProducer } from '../base.producer';

export class AppTransformSessionProducer extends BaseProducer implements TransformSessionProducer {
    all(sessions: TransformSession[]): void {
        
        throw new Error("Method not implemented.");
    }    
    
    newSession(session: TransformSession): void {
        throw new Error("Method not implemented.");
    }


    delete(dataGroupId: number): void {
        throw new Error("Method not implemented.");
    }


    updateSession(session: TransformSession): void {
        throw new Error("Method not implemented.");
    }
    updateDataGroup(dataGroup: ExperimentDataGroup, setings: DataGroupSettings) {
        throw new Error("Method not implemented.");
    }
    newDataGroup(dataGroup: ExperimentDataGroup, setings: DataGroupSettings) {
        throw new Error("Method not implemented.");
    }
    finish(dataGroupId: number): void {
        throw new Error("Method not implemented.");
    }




}

