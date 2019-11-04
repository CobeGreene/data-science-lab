import { ExperimentConverter } from './experiment.converter';
import { ExperimentData } from '../models';
import { Experiment, ExperimentStages, ExperimentSelectFetchStage,
         ExperimentSetupFetchStage, ExperimentSelectAlgorithmStage } from '../../../shared/models';

export class AppExperimentConverter implements ExperimentConverter {

    public convert(data: ExperimentData): Experiment {
        switch (data.stage) {
            case ExperimentStages.Select_Fetch:
                return this.toSelectFetchStage(data);
            case ExperimentStages.Setup_Fetch:
                return this.toSetupFetchStage(data);
            case ExperimentStages.Select_Algorithm:
                return this.toSelectAlgorithm(data);
            case ExperimentStages.Setup_Algorithm:
            case ExperimentStages.Train_Algorithm:
            case ExperimentStages.Test_Algorithm:
            default:
                throw new Error(`Experiment ${data.id}: stage out of range.`);
        }
    }

    private toSelectFetchStage(data: ExperimentData): Experiment {
        return new ExperimentSelectFetchStage({ id: data.id });
    }

    private toSetupFetchStage(data: ExperimentData): Experiment {
        return new ExperimentSetupFetchStage({
            id: data.id,
            plugin: data.fetchPluginChoice,
            optionList: data.fetchPlugin.getOptions().options()
        });
    }

    private toSelectAlgorithm(data: ExperimentData): Experiment {
        return new ExperimentSelectAlgorithmStage({
            id: data.id, data: data.data
        });
    }
}
