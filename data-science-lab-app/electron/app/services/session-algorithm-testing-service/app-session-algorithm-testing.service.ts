import { SessionAlgorithmTestingService } from './session-algorithm-testing.service';
import { ServiceContainer, SERVICE_TYPES } from '../../services-container';
import { AlgorithmTestingSessionProducer } from '../../producers';
import { AlgorithmTestingSessionService } from '../../session-services';
import { ExperimentAlgorithmDataService, ExperimentDataGroupDataService } from '../../data-services';
import { TestingSessionViewModel, PluginInputViewModel, TestReportViewModel } from '../../../../shared/view-models';


export class AppSessionAlgorithmTestingService implements SessionAlgorithmTestingService {

    get producer(): AlgorithmTestingSessionProducer {
        return this.serviceContainer.resolve<AlgorithmTestingSessionProducer>(SERVICE_TYPES.AlogirthmTestingSessionProducer);
    }

    get service(): AlgorithmTestingSessionService {
        return this.serviceContainer.resolve<AlgorithmTestingSessionService>(SERVICE_TYPES.AlogirthmTestingSessionService);
    }

    constructor(private serviceContainer: ServiceContainer) {

    }

    all(): void {
        this.producer.all(this.service.all());
    }

    request(id: number, dataGroupId: number) {
        const algorithms = this.serviceContainer.resolve<ExperimentAlgorithmDataService>(SERVICE_TYPES.AlgorithmDataService);
        const algorithm = algorithms.read(id);

        const testing = algorithm.algorithmPlugin.getTestingInputs();

        const vm = new TestingSessionViewModel({
            id,
            dataGroupId,
            inputs: testing.input.map((value): PluginInputViewModel => {
                return new PluginInputViewModel({
                    id: value.id,
                    label: value.label,
                    min: value.min,
                    type: value.type,
                    max: value.max
                });
            }),
            output: testing.output.map((value): PluginInputViewModel => {
                return new PluginInputViewModel({
                    id: value.id,
                    label: value.label,
                    min: value.min,
                    type: value.type,
                    max: value.max
                });
            })
        });

        this.service.create(vm);
        this.producer.newSession(vm);
    }

    startTest(id: number, inputs: { [id: string]: number[]; }, output: { [id: string]: number[]; }): void {
        const dataService = this.serviceContainer.resolve<ExperimentDataGroupDataService>(SERVICE_TYPES.ExperimentDataGroupDataService);
        const session = this.service.read(id);
        const algorithm = this.serviceContainer
            .resolve<ExperimentAlgorithmDataService>(SERVICE_TYPES.AlgorithmDataService).read(id).algorithmPlugin;

        const testing = algorithm.getTestingInputs();
        const examples = dataService.read(session.dataGroupId).examples;
        const pluginInput = dataService.getPluginData(session.dataGroupId, inputs);
        const pluginOutput = dataService.getPluginData(session.dataGroupId, output);

        let correct = 0;
        const total = examples || 0;

        for (let i = 0; i < total; ++i) {
            let testInputs = [];
            testing.input.forEach((value) => {
                const thisInput = pluginInput[value.id].examples[i];
                testInputs = testInputs.concat(thisInput);
            });
            
            let expected = [];
            testing.output.forEach((value) => {
                const thisOutput = pluginOutput[value.id].examples[i];
                expected = expected.concat(thisOutput);
            });
            
            const actual = algorithm.test(...testInputs);

            if (JSON.stringify(actual) === JSON.stringify(expected)) {
                correct += 1;
            }
        }

        this.service.delete(id);

        const report = new TestReportViewModel({
            algorithmId: id,
            correct,
            total
        });

        this.producer.finishSession(id);
    }




}
