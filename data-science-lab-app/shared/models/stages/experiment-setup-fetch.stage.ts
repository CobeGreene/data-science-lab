import { Experiment } from '../experiment';
import { ExperimentStages } from '../experiment_stages';
import { OptionList } from 'data-science-lab-core';
import { Plugin } from '../plugin';

export class ExperimentSetupFetchStage extends Experiment {

    public optionList: OptionList;
    public plugin: Plugin;

    constructor(experiment: {
        id: number, optionList: OptionList, plugin: Plugin
    }) {
        super({ id: experiment.id, stage: ExperimentStages.Setup_Fetch });
        this.optionList = experiment.optionList;
        this.plugin = experiment.plugin;
    }
}
