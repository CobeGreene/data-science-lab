import { ExperimentService } from './experiment.service';
import { ServiceContainer, SERVICE_TYPES } from '../../services-container';
import { Experiment } from '../../../../shared/models';
import {
    ExperimentDataService, ExperimentAlgorithmDataService, AlgorithmTrackerDataService,
    ExperimentDataGroupDataService, TestReportDataService, VisualizationDataService, SettingsDataService
} from '../../data-services';
import { ExperimentProducer } from '../../producers';
import * as zlib from 'zlib';
import * as fs from 'fs';
import { TestReportViewModel } from '../../../../shared/view-models';
import { RecorderService } from 'data-science-lab-core';

export class AppExperimentService implements ExperimentService {

    constructor(private serviceContainer: ServiceContainer) {

    }

    all(): void {
        const experimentDataService = this.serviceContainer.resolve<ExperimentDataService>(SERVICE_TYPES.ExperimentDataService);
        const experimentProducer = this.serviceContainer.resolve<ExperimentProducer>(SERVICE_TYPES.ExperimentProducer);
        experimentProducer.all(experimentDataService.all());
    }

    create(): void {
        const experimentDataService = this.serviceContainer.resolve<ExperimentDataService>(SERVICE_TYPES.ExperimentDataService);
        const newExperiment = experimentDataService.create(new Experiment({}));
        const experimentProducer = this.serviceContainer.resolve<ExperimentProducer>(SERVICE_TYPES.ExperimentProducer);
        experimentProducer.all(experimentDataService.all());
        experimentProducer.newExperiment(newExperiment);
    }

    load(id: number): void {
        const experimentDataService = this.serviceContainer.resolve<ExperimentDataService>(SERVICE_TYPES.ExperimentDataService);
        const experiment = experimentDataService.read(id);

        const settings = this.serviceContainer.resolve<SettingsDataService>(SERVICE_TYPES.SettingsDataService);
        const experimentPath = `${settings.readExperimentsFolder()}\\experiment${id}.gzip`;
        
        const experimentProducer = this.serviceContainer.resolve<ExperimentProducer>(SERVICE_TYPES.ExperimentProducer);
        if (!fs.existsSync(experimentPath)) {
            experimentProducer.load(id);
        }

        const buffer = fs.readFileSync(experimentPath);

        const json = JSON.parse(`${zlib.unzipSync(buffer)}`);

        const experimentDataGroupDataService = this.serviceContainer
            .resolve<ExperimentDataGroupDataService>(SERVICE_TYPES.ExperimentDataGroupDataService);
            
        experimentDataGroupDataService.load(json.dataGroups);

        const visualizationDataService = this.serviceContainer
            .resolve<VisualizationDataService>(SERVICE_TYPES.VisualizationDataService);

        visualizationDataService.load(json.visuals);
        
        const testReportDataService = this.serviceContainer
            .resolve<TestReportDataService>(SERVICE_TYPES.TestReportDataService);

        testReportDataService.load(json.reports);
        
        const algorithmTrackerDataService = this.serviceContainer
            .resolve<AlgorithmTrackerDataService>(SERVICE_TYPES.AlgorithmTrackerDataService);

        algorithmTrackerDataService.load(json.trackers);
        
        const algorithmDataService = this.serviceContainer
        .resolve<ExperimentAlgorithmDataService>(SERVICE_TYPES.AlgorithmDataService);
        
        algorithmDataService.load(json.algorithms);
        
        experiment.isLoaded = true;
        experimentDataService.update(experiment);
        experimentProducer.load(id);
    }

    save(id: number): void {

        const experimentDataService = this.serviceContainer.resolve<ExperimentDataService>(SERVICE_TYPES.ExperimentDataService);
        const experiment = experimentDataService.read(id);

        const algorithmDataService = this.serviceContainer.resolve<ExperimentAlgorithmDataService>(SERVICE_TYPES.AlgorithmDataService);

        const algorithms = algorithmDataService.all(id);

        const algorithmTrackerDataService = this.serviceContainer
            .resolve<AlgorithmTrackerDataService>(SERVICE_TYPES.AlgorithmTrackerDataService);

        const trackers = algorithms
            .filter(value => algorithmTrackerDataService.has(value.id))
            .map(value => algorithmTrackerDataService.read(value.id));

        const experimentDataGroupDataService = this.serviceContainer
            .resolve<ExperimentDataGroupDataService>(SERVICE_TYPES.ExperimentDataGroupDataService);

        const dataGroups = experimentDataGroupDataService.all(experiment.id);

        const testReportDataService = this.serviceContainer
            .resolve<TestReportDataService>(SERVICE_TYPES.TestReportDataService);

        const reports = [].concat.apply([], algorithms.map(value => testReportDataService.all(value.id))) as TestReportViewModel[];

        const visualizationDataService = this.serviceContainer
            .resolve<VisualizationDataService>(SERVICE_TYPES.VisualizationDataService);

        const visuals = visualizationDataService.all(id);


        const algorithmJsons = algorithmDataService.export(algorithms);

        const json = {
            experiment,
            algorithms: algorithmJsons,
            trackers,
            dataGroups,
            reports,
            visuals,
        };

        const buffer = zlib.gzipSync(JSON.stringify(json));

        const settings = this.serviceContainer.resolve<SettingsDataService>(SERVICE_TYPES.SettingsDataService);
        const path = `${settings.readExperimentsFolder()}\\experiment${id}.gzip`;

        fs.writeFileSync(path, buffer);

    }

}

