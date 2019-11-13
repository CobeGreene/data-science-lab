import { DataGroupConverter } from './data-group.converter';
import { ExperimentDataGroup, DataGroupSettings } from '../../models';
import { DataGroupViewModel } from '../../../../shared/view-models';


export class MockDataGroupConverter implements DataGroupConverter {


    toViewModel: (dataGroup: ExperimentDataGroup, settings: DataGroupSettings) => DataGroupViewModel;

    constructor() {
        this.reset();
    }

    reset() {
        this.toViewModel = () => { throw new Error(`Not implemented`); };
    }

}

