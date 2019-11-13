import { FetchSessionProducer } from './fetch-session.producer';
import { FetchSession, ExperimentDataGroup, DataGroupSettings } from '../../models';


export class MockFetchSessionProducer implements FetchSessionProducer {

    all: (fetchSessions: FetchSession[]) => void;

    newSession: (fetchSession: FetchSession) => void;

    error: (reason: any) => void;

    delete: (experimentId: number) => void;

    updateSession: (fetchSession: FetchSession) => void;

    newDataGroup: (dataGroup: ExperimentDataGroup, settings: DataGroupSettings) => void;

    finish: (id: number) => void;

    constructor() {
        this.reset();
    }

    reset() {
        this.all = () => { };
        this.newSession = () => { };
        this.error = () => { };
        this.delete = () => { };
        this.finish = () => { };
        this.updateSession = () => { };
        this.newDataGroup = () => { };
    }
} 
