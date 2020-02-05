import { TestingSessionViewModel } from '../../../../shared/view-models';

export interface AlgorithmTestingSessionService {

    all(): TestingSessionViewModel[];
    read(id: number): TestingSessionViewModel;
    delete(id: number): void;
    create(vm: TestingSessionViewModel);

}

