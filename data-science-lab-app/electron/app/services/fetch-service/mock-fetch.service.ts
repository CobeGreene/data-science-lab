import { FetchService } from './fetch.service';
import { Plugin } from '../../../../shared/models';

export class MockFetchService implements FetchService {
    all: () => void;
    
    create: (experimentId: number, plugin: Plugin) => void;
    
    executeCommand: (experimentId: number, command: string) => void;

    submitOptions: (experimentId: number, inputs: { [id: string]: any; }) => void;

    delete: (experimentId: number) => void;

    constructor() {
        this.reset();
    }

    reset() {
        this.all = (): void => {};
        this.create = (): void => {};
        this.executeCommand = (): void => {};
        this.submitOptions = (): void => {};
        this.delete = (): void => {};
    }


}
