import { ExperimentService } from './experiment.service';
import { Experiment, ExperimentList, ExperimentSelectFetchStage, Plugin, ExperimentSetupFetchStage } from '../../../../shared/models';
import { Subject } from 'rxjs';
import { ExperimentAlgorithmPlugins } from '../../models';

export class MockExperimentService implements ExperimentService {
    public experimentsChanged: Subject<ExperimentList>;
    public newExperiment: Subject<Experiment>;
    public fetchPlugins: Subject<Plugin[]>;
    public experimentAlgorithmPlugins: Subject<ExperimentAlgorithmPlugins>;

    private experimentList: ExperimentList;
    private fetchPluginList: Plugin[];
    private experimentAlgorithmPluginsList: ExperimentAlgorithmPlugins[];

    constructor() {
        this.experimentsChanged = new Subject<ExperimentList>();
        this.newExperiment = new Subject<Experiment>();
        this.fetchPlugins = new Subject<Plugin[]>();
        this.experimentAlgorithmPlugins = new Subject<ExperimentAlgorithmPlugins>();

        this.experimentList = new ExperimentList();
        this.fetchPluginList = [];
        this.experimentAlgorithmPluginsList = [];
    }

    static init(experimentList: ExperimentList,
                fetchPluginList?: Plugin[],
                experimentAlgorithmPluginsList?: ExperimentAlgorithmPlugins[]): MockExperimentService {
        const service = new MockExperimentService();
        service.experimentList = experimentList;
        service.fetchPluginList = fetchPluginList || [];
        service.experimentAlgorithmPluginsList = experimentAlgorithmPluginsList || [];
        return service;
    }

    all(): ExperimentList {
        return this.experimentList;
    }

    getExperimentAlgorithmPlugins(id: number): ExperimentAlgorithmPlugins {
        const find = this.experimentAlgorithmPluginsList.find((value: ExperimentAlgorithmPlugins) => {
            return value.id === id;
        });        
        return find || new ExperimentAlgorithmPlugins({ id, algorithmPlugins: [] });
    }

    getFetchPlugins(): Plugin[] {
        return this.fetchPluginList;
    }

    selectFetchPlugin(id: number, plugin: Plugin): void {
        let find = this.experimentList.experiments.findIndex((value: Experiment) => {
            return value.id === id;
        });
        if (find < 0) {
            throw new Error('Experiment not found.');
        }
        this.experimentList.experiments[find] = new ExperimentSetupFetchStage({ id });
        this.experimentsChanged.next(this.experimentList);
    }

    create(): void {
        let max = 1;
        this.experimentList.experiments.forEach((value: Experiment) => {
            if (value.id >= max) {
                max = value.id + 1;
            }
        });
        const experiment = new ExperimentSelectFetchStage({ id: max });

        this.experimentList.experiments.push(
            experiment
        );
        this.experimentsChanged.next(this.experimentList);
        this.newExperiment.next(experiment);
    }

    get(id: number): Experiment {
        const found = this.experimentList.experiments.find((value: Experiment) => {
            return value.id === id;
        });
        if (!found) {
            throw new Error('Couldn\'t find experiment');
        } else {
            return found;
        }
    }

    updateFetchPlugins(pluginList: Plugin[]) {
        this.fetchPluginList = pluginList;
        this.fetchPlugins.next(this.fetchPluginList);
    }

    updateExperimentAlgorithmPlugins(id: number, pluginList: Plugin[]) {
        let find = this.experimentAlgorithmPluginsList.find((value: ExperimentAlgorithmPlugins) => {
            return value.id === id;
        });
        if (find) {
            find.algorithmPlugins = pluginList;
        } else {
            find = new ExperimentAlgorithmPlugins({
                id, algorithmPlugins: pluginList
            });
            this.experimentAlgorithmPluginsList.push(find);
        }
        this.experimentAlgorithmPlugins.next(find);
    }
}
