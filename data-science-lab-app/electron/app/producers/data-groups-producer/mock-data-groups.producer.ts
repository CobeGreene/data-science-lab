import { DataGroupsProducers } from './data-groups.producer';
import { ExperimentDataGroup, DataGroupSettings } from '../../models';


export class MockDataGroupsProducer implements DataGroupsProducers {

    all: (experimentDataGroups: ExperimentDataGroup[], dataGroupSettings: DataGroupSettings) => void;

    delete: (id: number) => void;

    error: (reason: any) => void;

    constructor() {
        this.reset();
    }

    reset() {
        this.all = () => { };
        this.delete = () => { };
        this.error = () => { };
    }



}

