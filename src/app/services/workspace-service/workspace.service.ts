export abstract class WorkspaceService {
    abstract get<T>(name: string, defaultValue?: T);
    abstract set<T>(name: string, value: T);
}
