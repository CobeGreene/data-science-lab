import { Session } from '../../../../shared/models';

export interface SessionDataService {
    all(): Session[];
    post(session: Session): Session;
    get(id: number): Session;
    update(session: Session): void;
    delete(id: number): void;
    reference<T>(id: number): T;
    reference<T>(id: number, plugin: T): void;
}

