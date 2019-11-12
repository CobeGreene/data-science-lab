import { ExperimentDataGroup } from '../../models';

export interface ExperimentDataGroupDataService {
    all(experimentId?: number): ExperimentDataGroup[];
    create(dataGroup: ExperimentDataGroup): ExperimentDataGroup;
    read(id: number): ExperimentDataGroup;
    update(dataGroup: ExperimentDataGroup): void;
    delete(id: number): void;
    deleteByExperiment(experimentId: number): void;
}


