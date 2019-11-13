import { Producer } from '../producer';
import { ExperimentDataGroup, DataGroupSettings } from '../../models';


export interface DataGroupsProducers extends Producer {

    all(experimentDataGroups: ExperimentDataGroup[], settings: DataGroupSettings);
    delete(id: number): void;

}

