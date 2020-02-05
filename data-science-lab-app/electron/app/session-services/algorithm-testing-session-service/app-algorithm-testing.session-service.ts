import { AlgorithmTestingSessionService } from './algorithm-testing.session-service';
import { TestingSessionViewModel } from '../../../../shared/view-models';


export class AppAlgorithmTestingSessionService implements AlgorithmTestingSessionService {
    
    sessions: TestingSessionViewModel[];

    constructor() {
        this.sessions = [];
    }
    
    all(): TestingSessionViewModel[] {
        return this.sessions;
    }    
    
    read(id: number): TestingSessionViewModel {
        const find = this.sessions.find((value) => {
            return value.id === id;
        });
        if (find) {
            return find;
        }
        throw new Error(`Couldn't find testing session with id ${id}`);
    }
    
    delete(id: number): void {
        const find = this.sessions.findIndex((value) => {
            return value.id === id;
        });
        if (find >= 0) {
            this.sessions.splice(find, 1);
        } else {
            throw new Error(`Couldn't find testing session with id ${id}`);
        }
    }
    
    create(vm: TestingSessionViewModel) {
        const find = this.sessions.find((value) => {
            return value.id === vm.id;
        });
        if (find) {
            throw new Error(`Couldn't recreate an session for algorithm with id ${vm.id}`);
        }
        this.sessions.push(vm);
    }


}
