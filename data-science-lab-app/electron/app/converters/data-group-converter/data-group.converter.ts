import { ExperimentDataGroup, DataGroupSettings } from '../../models';
import { DataGroupViewModel } from '../../../../shared/view-models';

export interface DataGroupConverter {

    toViewModel(dataGroup: ExperimentDataGroup, settings: DataGroupSettings): DataGroupViewModel;
}



