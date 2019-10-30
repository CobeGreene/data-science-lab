import { Experiment, ExperimentList, Plugin } from '../../../../shared/models';
import { Subject } from 'rxjs';
import { ExperimentAlgorithmPlugins } from '../../models';

export abstract class ExperimentService {
    public experimentsChanged: Subject<ExperimentList>;
    public newExperiment: Subject<Experiment>;
    public fetchPlugins: Subject<Plugin[]>;
    public experimentAlgorithmPlugins: Subject<ExperimentAlgorithmPlugins>;

    abstract all(): ExperimentList;
    abstract getFetchPlugins(): Plugin[];
    abstract getExperimentAlgorithmPlugins(id: number): ExperimentAlgorithmPlugins; 
    abstract create(): void; 
    abstract get(id: number): Experiment;
}

