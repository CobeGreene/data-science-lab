import { ExperimentSetuptInputService } from './experiment-setup-input.service';
import { ExperimentDataService } from '../experiment-data-service';
import { ExperimentProducer } from '../../producers';
import { ExperimentStages } from '../../../../shared/models';
import { ExperimentConverter } from '../../converters';

export class AppExperimentSetupInputService implements ExperimentSetuptInputService {
    
    private experimentProducer: ExperimentProducer;
    private experimentDataService: ExperimentDataService;
    private converter: ExperimentConverter;

    constructor(experimentProducer: ExperimentProducer,
                experimentDataService: ExperimentDataService,
                converter: ExperimentConverter) {
        this.experimentProducer = experimentProducer;
        this.experimentDataService = experimentDataService;
        this.converter = converter;
    }

    submit(id: number, inputs: { [id: string]: any; }) {
        const experiment = this.experimentDataService.get(id);

        if (experiment.stage === ExperimentStages.Setup_Fetch) {
            const options = experiment.fetchPlugin.getOptions();
            options.submit(inputs);

            if (options.noMore()) {
                experiment.stage = ExperimentStages.Select_Algorithm;
            }

            this.experimentDataService.update(id, experiment);
            const updatedExperiment = this.converter.convert(experiment);
            this.experimentProducer.update(updatedExperiment);
        } else if (experiment.stage === ExperimentStages.Setup_Algorithm) {
            throw new Error('Error: Not implemented');
        } else {
            throw new Error('Shouldn\'t be calling on this experiment');
        }

    }

}
