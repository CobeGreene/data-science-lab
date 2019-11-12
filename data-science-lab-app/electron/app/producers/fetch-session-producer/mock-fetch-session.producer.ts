import { FetchSessionProducer } from './fetch-session.producer';
import { FetchSession } from '../../models';


export class MockFetchSessionProducer implements FetchSessionProducer {
    
    all: (fetchSessions: FetchSession[])  => void;
    
    newSession: (fetchSession: FetchSession) => void;
    
    error: (reason: any) => void;
    
    delete: (experimentId: number) => void;
    
    updateSession: (fetchSession: FetchSession) => void;
    
    finish: (experimentId: number) => void;
    
    constructor() {
        this.reset();
    }

    reset() {
        this.all = () => {};
        this.newSession = () => {};
        this.error = () => {};
        this.delete = () => {};
        this.updateSession = () => {};
        this.finish = () => {};
    }
} 
