
export abstract class SidebarService {

    abstract get<T>(name: string, defaultValue?: T);
    abstract set<T>(name: string, value: T);
}
