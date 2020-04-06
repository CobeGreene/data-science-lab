import { ServiceModel } from '../../services/service-model';
import { ServiceContainer, SERVICE_TYPES } from '../../service-container';
import { Producer, ServiceModelRoutes } from '../../pipeline';
import { TestReportSessionDataService } from '../../data-services/test-report-session-data-service';
import { AlgorithmDataService } from '../../data-services/algorithm-data-service';
import { DatasetDataService } from '../../data-services/dataset-data-service';
import { TestReportDataService } from '../../data-services/test-report-data-service';
import { SessionOptions, SessionState, TestReportSession, TestReport } from '../../../../shared/models';
import { TestReportCreateEvents, TestReportEvents } from '../../../../shared/events';
import { ErrorTypes } from '../../../../shared/errors';
import { TestReportObject, FeatureObject } from '../../models';


export class CreateTestReportServiceModel extends ServiceModel {

    static routes: ServiceModelRoutes = {
        service: SERVICE_TYPES.CreateTestReportServiceModel,
        routes: [
            { path: TestReportCreateEvents.Create, method: 'create' },
            { path: TestReportCreateEvents.Delete, method: 'delete' },
            { path: TestReportCreateEvents.Select, method: 'select' },
            { path: TestReportCreateEvents.Inputs, method: 'inputs' },
            { path: TestReportCreateEvents.Previous, method: 'previous' },
        ]
    };

    private dataService: TestReportDataService;
    private algorithmService: AlgorithmDataService;
    private sessionService: TestReportSessionDataService;
    private datasetService: DatasetDataService;

    constructor(serviceContainer: ServiceContainer, producer: Producer) {
        super(serviceContainer, producer);

        this.dataService = serviceContainer.resolve<TestReportDataService>(SERVICE_TYPES.TestReportDataService);
        this.sessionService = serviceContainer.resolve<TestReportSessionDataService>(SERVICE_TYPES.TestReportSessionDataService);
        this.algorithmService = serviceContainer.resolve<AlgorithmDataService>(SERVICE_TYPES.AlgorithmDataService);
        this.datasetService = serviceContainer.resolve<DatasetDataService>(SERVICE_TYPES.DatasetDataService);
    }

    create(algorithmId: number, options: SessionOptions, returnPath?: string) {
        const obj = this.algorithmService.get(algorithmId); 
        const { input, output } = obj.algorithm.getTestingInputs();
        let session: TestReportSession = {
            id: 0,
            algorithmId,
            isWaiting: false,
            sessionOptions: options,
            plugin: obj.plugin,
            state: SessionState.Select,
            returnPath,
            inputs: input.concat(output),
        };
        session = this.sessionService.post(session);
        this.producer.send(TestReportCreateEvents.Create, session);
    }

    delete(id: number) {
        this.sessionService.delete(id);
        this.producer.send(TestReportCreateEvents.Delete, id);
    }

    select(id: number, datasetId: number, selectedFeatures: number[]) {
        const session = this.sessionService.get(id);
        session.datasetId = datasetId;
        session.selectedFeatures = selectedFeatures;
        session.state = SessionState.Input;
        session.isWaiting = false;
        this.sessionService.update(session);
        this.producer.send(TestReportCreateEvents.Update, session);
    }

    inputs(id: number, inputDict: { [id: string]: number[]; }) {
        const session = this.sessionService.get(id);
        session.inputDict = inputDict;
        const obj = this.algorithmService.get(session.algorithmId);
        const { input, output } = obj.algorithm.getTestingInputs();

        const inputs: { [id: string]: number[]; } = {};
        const outputs: { [id: string]: number[]; } = {};

        for (const pluginInput of input) {
            inputs[pluginInput.id] = inputDict[pluginInput.id];
        }
        for (const pluginOutput of output) {
            outputs[pluginOutput.id] = inputDict[pluginOutput.id];
        }

        const dataset = this.datasetService.get(session.datasetId);
        const inputData = this.datasetService.extract(session.datasetId, inputs, session.selectedFeatures);
        const outputData = this.datasetService.extract(session.datasetId, outputs, session.selectedFeatures);

        const examples = dataset.examples;
        let correct = 0;
        const total = examples || 0;

        const isTraining = obj.isTraining;

        const expectedFeatures: FeatureObject[] = ([] as FeatureObject[]).concat(...output.map(value => {
            return outputs[value.id].map(index => ({
                name: `Expected ${dataset.features[index].name}`,
                type: dataset.features[index].type,
                examples: dataset.features[index].examples.slice()
            }));
        }));
        const actualFeatures: FeatureObject[] = ([] as FeatureObject[]).concat(...output.map(value => {
            return outputs[value.id].map(index => ({
                name: `Actual ${dataset.features[index].name}`,
                type: dataset.features[index].type,
                examples: []
            }));
        }));;
        const correctFeature: FeatureObject = {
            name: 'Correct',
            type: 'number',
            examples: []
        };

        if (isTraining) {
            this.algorithmService.stop(session.algorithmId);
        }

        for (let i = 0; i < total; ++i) {
            let testInputs = [];
            input.forEach((value) => {
                const thisInput = inputData[value.id].examples[i];
                testInputs = testInputs.concat(thisInput);
            });

            let expected = [];
            output.forEach((value) => {
                const thisOutput = outputData[value.id].examples[i];
                expected = expected.concat(thisOutput);
            });

            const actual = obj.algorithm.test(testInputs);

            const isCorrect = JSON.stringify(actual) === JSON.stringify(expected); 

            correctFeature.examples.push(+isCorrect);
            actualFeatures.forEach((value, index) => {
                value.examples.push(actual[index]);
            });

            if (isCorrect) {
                correct += 1;
            }
        }

        if (isTraining) {
            this.algorithmService.start(session.algorithmId);
        }

        let report: TestReportObject = {
            id: 0, 
            algorithmId: session.algorithmId,
            correct,
            total: examples,
            iteration: obj.iteration,
            datasetId: dataset.id,
            features: [...expectedFeatures, ...actualFeatures, correctFeature],
            selectedFeatures: session.selectedFeatures,
            name: 'Test Report',
        };

        this.sessionService.delete(session.id);
        report = this.dataService.post(report);
        
        this.producer.send(TestReportEvents.Create, this.dataService.view(report.id));
        this.producer.send(TestReportCreateEvents.Finish, id);
    }

    previous(id: number) {
        const session = this.sessionService.get(id);
        if (session.state === SessionState.Select) {
            this.sessionService.delete(id);
            this.producer.send(TestReportCreateEvents.Finish, id, session.returnPath);
        } else if (session.state === SessionState.Input) {
            session.state = SessionState.Select;
            session.inputDict = undefined;
            session.isWaiting = false;
            session.datasetId = undefined;
            this.sessionService.update(session);
            this.producer.send(TestReportCreateEvents.Update, session);
        } else {
            throw {
                header: 'Test Report Session Error',
                description: `test report session ${id} is in invalid state`,
                type: ErrorTypes.Error
            };
        }
    }

}


