import { WorkspaceService } from './workspace.service';

export class AppWorkspaceService extends WorkspaceService {

    data: { [name: string]: any };

    constructor() {
        super();
        this.data = {};
    }

    get<T>(name: string, defaultValue?: T) {
        if (this.data[name] !== undefined) {
            return this.data[name] as T;
        } else if (defaultValue !== undefined) {
            this.data[name] = defaultValue;
            return defaultValue;
        } else {
            throw new Error(`Couldn't find workspace value for ${name} and no default provided.`);
        }
    }

    set<T>(name: string, value: T) {
        this.data[name] = value;
    }
}

