import { ExperimentStages, Experiment, Plugin } from '../../../shared/models';
import { FetchPlugin } from 'data-science-lab-core';

export class ExperimentData {
    public id: number;
    public stage: ExperimentStages;

    constructor(data: { id: number, stage: ExperimentStages }) {
        this.id = data.id;
        this.stage = data.stage;
    }

    public fetchPluginChoice: Plugin;
    public fetchPlugin: FetchPlugin;

}
