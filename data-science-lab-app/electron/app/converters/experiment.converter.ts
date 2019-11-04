import { ExperimentData } from '../models';
import { Experiment } from '../../../shared/models';

export interface ExperimentConverter {
    convert(data: ExperimentData): Experiment;
}
