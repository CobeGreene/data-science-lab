import { ExperimentService } from './experiment.service';
import { ExperimentDataService } from '../experiment-data-service';
import { ExperimentConverter } from '../../converters';
import { ExperimentProducer } from '../../producers';
import { ExperimentList } from '../../../../shared/models';

export class AppExperimentService implements ExperimentService {

    private experimentDataService: ExperimentDataService;
    private experimentProducer: ExperimentProducer;
    private experimentConverter: ExperimentConverter;

    constructor(experimentDataService: ExperimentDataService,
                experimentProducer: ExperimentProducer,
                experimentConverter: ExperimentConverter) {
        this.experimentDataService = experimentDataService;
        this.experimentProducer = experimentProducer;
        this.experimentConverter = experimentConverter;
    }

    all(): void {
        const all = this.experimentDataService.all();
        const converterList = new ExperimentList();
        all.forEach((value) => {
            converterList.experiments.push(this.experimentConverter.convert(value));
        });
        this.experimentProducer.all(converterList);
    }    
    
    create(): void {
        const experimentData = this.experimentDataService.create();
        const experiment = this.experimentConverter.convert(experimentData);
        this.experimentProducer.create(experiment);
    }


}
