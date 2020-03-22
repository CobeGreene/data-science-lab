import { ServiceContainer, Service } from '../../service-container';
import { TestReportSession } from '../../../../shared/models';
import { SystemError, ErrorTypes } from '../../../../shared/errors';
import { IdGenerator } from '../../data-structures';
import { TestReportSessionDataService } from './test-report-session.data-service';

export class AppTestReportSessionDataService extends Service implements TestReportSessionDataService {
    private sessions: TestReportSession[];
    private idGenerator: IdGenerator;

    constructor(serviceContainer: ServiceContainer) {
        super(serviceContainer);

        this.sessions = [];
        this.idGenerator = new IdGenerator(1);
    }

    all(): TestReportSession[] {
        return this.sessions;
    }

    post(session: TestReportSession): TestReportSession {
        session.id = this.idGenerator.next();
        this.sessions.push(session);
        return session;
    }

    get(id: number): TestReportSession {
        const find = this.sessions.find(value => value.id === id);
        
        if (find === undefined) {
            throw this.notFound(id);
        }

        return find;
    }
    update(session: TestReportSession): void {
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
    }


    notFound(id: number): SystemError {
        return {
            header: 'Test Report Session Data Service',
            description: `Couldn\'t find session with id ${id}`,
            type: ErrorTypes.Error
        };
    }
}



