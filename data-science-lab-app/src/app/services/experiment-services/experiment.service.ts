import { Experiment, ExperimentList, Plugin, CommandOption } from '../../../../shared/models';
import { Subject } from 'rxjs';
import { ExperimentAlgorithmPlugins } from '../../models';

export abstract class ExperimentService {
    public experimentsChanged: Subject<ExperimentList>;
    public experimentUpdated: Subject<Experiment>;
    public newExperiment: Subject<Experiment>;

    abstract all(): ExperimentList;
    abstract create(): void; 
    abstract get(id: number): Experiment;
}

