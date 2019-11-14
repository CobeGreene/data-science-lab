import { DataGroupsService } from './data-groups.service';


export class MockDataGroupsService implements DataGroupsService {
    all: () => void;
    
    delete: (experimentId: number) => void;

    constructor() {
        this.reset();
    }
    
    reset() {
        this.all = () => {};
        this.delete = () => {};
    }

}
