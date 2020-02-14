import { DataGroupsService } from './data-groups.service';


export class MockDataGroupsService implements DataGroupsService {
    all: () => void;
    
    delete: (id: number) => void;


    constructor() {
        this.reset();
    }
    
    reset() {
        this.all = () => {};
        this.delete = () => {};
    }

}
