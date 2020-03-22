import { Service, ServiceContainer } from '../../service-container';
import { Session } from '../../../../shared/models';
import { SystemError, ErrorTypes } from '../../../../shared/errors';
import { IdGenerator } from '../../data-structures';
import { SessionDataService } from './session.data-service';

export class AppSessionDataService extends Service implements SessionDataService {
    private sessions: Session[];
    private plugins: {[id: number]: any};
    private idGenerator: IdGenerator;

    constructor(serviceContainer: ServiceContainer) {
        super(serviceContainer);

        this.sessions = [];
        this.plugins = {};
        this.idGenerator = new IdGenerator(1);
    }

    all(): Session[] {
        return this.sessions;    
    }

    post(session: Session): Session {
        session.id = this.idGenerator.next();
        this.sessions.push(session);
        return session;
    }

    get(id: number): Session {
        const find = this.sessions.find(value => value.id === id);
        
        if (find === undefined) {
            throw this.notFound(id);
        }

        return find;
    }
    update(session: Session): void {
        const find = this.sessions.findIndex((value) => value.id === session.id);

        if (find < 0) {
            throw this.notFound(session.id);
        }

        this.sessions.splice(find, 1, session);
    }

    delete(id: number): void {
        const find = this.sessions.findIndex((value) => value.id === id);
        if (find < 0) {
            throw this.notFound(id);
        }
        this.sessions.splice(find, 1);
        if (this.plugins[id] !== undefined) {
            delete this.plugins[id];
        }
    }


    notFound(id: number): SystemError {
        return {
            header: 'Session Data Service',
            description: `Couldn\'t find session with id ${id}`,
            type: ErrorTypes.Error
        };
    }

    reference<T>(id: number): T;
    reference<T>(id: number, plugin: T): void;
    reference<T>(id: number, plugin?: T) {
        const find = this.sessions.findIndex((value) => value.id === id);
        if (find < 0) {
            throw this.notFound(id);
        }
        if (plugin === undefined) {
            if (this.plugins[id] === undefined) {
                throw this.notFound(id);
            } 
            return this.plugins[id] as T;
        } else {
            this.plugins[id] = plugin;
        }
    }
}



