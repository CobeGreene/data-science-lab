import { SidebarService } from './sidebar.service';

export class AppSidebarService extends SidebarService {

    values: {[name: string]: any};

    constructor() {
        super();
        this.values = {};
    }

    get<T>(name: string, defaultValue?: T) {
        if (this.values[name] !== undefined) {
            return this.values[name] as T;
        } else if (defaultValue !== undefined) {
            this.values[name] = defaultValue;
            return defaultValue;
        } else {
            throw new Error(`Couldn't find sidebar value for ${name} and no default provided.`);
        }
    }
    
    set<T>(name: string, value: T) {
        this.values[name] = value;
    }
}
