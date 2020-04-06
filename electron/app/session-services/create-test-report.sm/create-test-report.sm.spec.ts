import { CreateTestReportServiceModel } from "./create-test-report.sm";
import { TestReportDataService } from "../../data-services/test-report-data-service";
import { AlgorithmDataService } from "../../data-services/algorithm-data-service";
import { TestReportSessionDataService } from "../../data-services/test-report-session-data-service";
import { DatasetDataService } from "../../data-services/dataset-data-service";
import { ServiceContainer, SERVICE_TYPES } from "../../service-container";
import { Producer } from "../../pipeline";
import { SessionState } from "../../../../shared/models";
import { TestReportCreateEvents } from "../../../../shared/events";
import { PluginData, PluginDataInput } from "data-science-lab-core";

describe('Electron Create Test Report Service Model', () => {
    let serviceModel: CreateTestReportServiceModel;
    let dataService: TestReportDataService;
    let algorithmService: AlgorithmDataService;
    let sessionService: TestReportSessionDataService;
    let datasetService: DatasetDataService;
    let serviceContainer: ServiceContainer;
    let producer: Producer;

    beforeEach(() => {
        serviceContainer = jasmine.createSpyObj('ServiceContainer', ['resolve']);
        (serviceContainer.resolve as jasmine.Spy).and.callFake((type: SERVICE_TYPES) => {
            if (type === SERVICE_TYPES.TestReportDataService) {
                return dataService;
            } else if (type === SERVICE_TYPES.DatasetDataService) {
                return datasetService;
            } else if (type === SERVICE_TYPES.AlgorithmDataService) {
                return algorithmService;
            } else if (type === SERVICE_TYPES.TestReportSessionDataService) {
                return sessionService;
            } else if (type)
                throw new Error(`Couldn't resolve type ${type}`);
        });
        producer = jasmine.createSpyObj('Producer', ['send']);
        datasetService = jasmine.createSpyObj('DatasetService', ['extract', 'get']);
        algorithmService = jasmine.createSpyObj('AlgorithmDataService', ['get', 'start', 'stop']);
        sessionService = jasmine.createSpyObj('TestReportSessionDataService', ['post', 'delete', 'get', 'update']);
        dataService = jasmine.createSpyObj('TestReportDataService', ['post', 'view']);

        serviceModel = new CreateTestReportServiceModel(serviceContainer, producer);
    });

    it('create should create a session with state', () => {
        (algorithmService.get as jasmine.Spy).and.callFake(() => {
            const plugin = jasmine.createSpyObj('AlgorithmPlugin', ['getTestingInputs']);
            (plugin.getTestingInputs as jasmine.Spy).and.callFake(() => {
                return { input: [], output: [] };
            });

            return {
                algorithm: plugin,
                plugin: {}
            }
        });
        (sessionService.post as jasmine.Spy).and.returnValue({});
        serviceModel.create(1, {} as any, '');
        expect(producer.send).toHaveBeenCalledTimes(1);
        expect(producer.send).toHaveBeenCalledWith(TestReportCreateEvents.Create, {});
        expect(sessionService.post).toHaveBeenCalledTimes(1);
        expect(sessionService.post).toHaveBeenCalledWith({
            id: 0,
            algorithmId: 1,
            isWaiting: false,
            sessionOptions: {},
            plugin: {},
            state: SessionState.Select,
            returnPath: '',
            inputs: [],
        });
    });

    it('delete should call session service', () => {
        serviceModel.delete(1);
        expect(sessionService.delete).toHaveBeenCalledTimes(1);
        expect(sessionService.delete).toHaveBeenCalledWith(1);
        expect(producer.send).toHaveBeenCalledWith(TestReportCreateEvents.Delete, 1);
    });

    it('select should update session service', () => {
        (sessionService.get as jasmine.Spy).and.returnValue({
        });
        serviceModel.select(1, 1, []);
        expect(sessionService.update).toHaveBeenCalledTimes(1);
        expect(sessionService.update).toHaveBeenCalledWith({
            datasetId: 1,
            selectedFeatures: [],
            state: SessionState.Input,
            isWaiting: false
        });
        expect(producer.send).toHaveBeenCalledTimes(1);
        expect(producer.send).toHaveBeenCalledWith(TestReportCreateEvents.Update, {
            datasetId: 1,
            selectedFeatures: [],
            state: SessionState.Input,
            isWaiting: false
        });
    });

    it('previous on select should finish session', () => {
        (sessionService.get as jasmine.Spy).and.returnValue({
            state: SessionState.Select,
            returnPath: 'path',
        });

        serviceModel.previous(1);
        expect(sessionService.delete).toHaveBeenCalledTimes(1);
        expect(sessionService.delete).toHaveBeenCalledWith(1);
        expect(producer.send).toHaveBeenCalledWith(TestReportCreateEvents.Finish, 1,
            'path');
    });

    it('previous on input should update session', () => {
        (sessionService.get as jasmine.Spy).and.returnValue({
            state: SessionState.Input,
            inputDict: {},
            isWaiting: true,
            datasetId: 1
        });
        serviceModel.previous(1);
        expect(sessionService.update).toHaveBeenCalledTimes(1);
        expect(sessionService.update).toHaveBeenCalledWith({
            state: SessionState.Select,
            inputDict: undefined,
            isWaiting: false,
            datasetId: undefined
        });
        expect(producer.send).toHaveBeenCalledTimes(1);
        expect(producer.send).toHaveBeenCalledWith(TestReportCreateEvents.Update, {
            state: SessionState.Select,
            inputDict: undefined,
            isWaiting: false,
            datasetId: undefined
        });
    });

    it('previous on undefined should throw error', () => {
        (sessionService.get as jasmine.Spy).and.returnValue({
        });
        expect(() => {
            serviceModel.previous(1);
        }).toThrow();
    });

    it('input should calculate test report', () => {
        (sessionService.get as jasmine.Spy).and.returnValue({
            inputDict: undefined,
            algorithmId: 1,
            id: 1,
            selectedFeatures: [0,1]
        });
        (algorithmService.get as jasmine.Spy).and.callFake(() => {
            const plugin = jasmine.createSpyObj('AlgorithmPlugins', ['getTestingInputs', 'test']);
            (plugin.getTestingInputs as jasmine.Spy).and.callFake(() => {
                const input: PluginDataInput[] = [
                    new PluginDataInput({
                        id: 'input',
                        label: 'input',
                        type: 'number',
                        min: 2, max: 2
                    })
                ];
                const output: PluginDataInput[] = [
                    new PluginDataInput({
                        id: 'output',
                        label: 'output',
                        type: 'number',
                        min: 1, max: 1
                    })
                ];
                (plugin.test as jasmine.Spy).and.returnValues([1], [1], [1], [1]);
                return { input, output };
            });
            return {
                algorithm: plugin,
                isTraining: false,
                iteration: 1
            }
        });

        (datasetService.get as jasmine.Spy).and.returnValue({
            examples: 4,
            id: 1,
            name: 'Dataset',
            features: [
                {
                    name: 'output',
                    type: 'number',
                    examples: [1, 0, 1, 1]
                },
            ]
        });

        (datasetService.extract as jasmine.Spy).and.returnValues(
            {
                input: new PluginData({
                    features: ['feature 1', 'feature 2'],
                    examples: [[1, 1], [2, 2], [3, 3], [4, 4]]
                })
            },
            {
                output: new PluginData({
                    features: ['output'],
                    examples: [[1], [0], [1], [1]]
                })
            }
        );
        (dataService.post as jasmine.Spy).and.returnValue({});

        serviceModel.inputs(1, { output: [0], input: [1]});

        expect(sessionService.delete).toHaveBeenCalledTimes(1);
        expect(sessionService.delete).toHaveBeenCalledWith(1);
        expect(dataService.post).toHaveBeenCalledTimes(1);
        expect(dataService.post).toHaveBeenCalledWith({
            id: 0,
            algorithmId: 1,
            correct: 3,
            total: 4,
            iteration: 1,
            datasetId: 1,
            name: 'Test Report',
            selectedFeatures: [0,1],
            features: [
                {
                    name: 'Expected output',
                    type: 'number',
                    examples: [1, 0, 1, 1]
                },
                {
                    name: 'Actual output',
                    type: 'number',
                    examples: [1, 1, 1, 1]
                },
                {
                    name: 'Correct',
                    type: 'number',
                    examples: [1, 0, 1, 1]
                }
            ]
        });

    });
    
    it('input should stop and start algorithm', () => {
        (sessionService.get as jasmine.Spy).and.returnValue({
            inputDict: undefined,
            algorithmId: 1,
            id: 1,
            selectedFeatures: [0,1]
        });
        (algorithmService.get as jasmine.Spy).and.callFake(() => {
            const plugin = jasmine.createSpyObj('AlgorithmPlugins', ['getTestingInputs', 'test']);
            (plugin.getTestingInputs as jasmine.Spy).and.callFake(() => {
                const input: PluginDataInput[] = [
                    new PluginDataInput({
                        id: 'input',
                        label: 'input',
                        type: 'number',
                        min: 2, max: 2
                    })
                ];
                const output: PluginDataInput[] = [
                    new PluginDataInput({
                        id: 'output',
                        label: 'output',
                        type: 'number',
                        min: 1, max: 1
                    })
                ];
                (plugin.test as jasmine.Spy).and.returnValues([1], [1], [1], [1]);
                return { input, output };
            });
            return {
                algorithm: plugin,
                isTraining: true,
                iteration: 1
            }
        });

        (datasetService.get as jasmine.Spy).and.returnValue({
            examples: 4,
            id: 1,
            name: 'Dataset',
            features: [
                {
                    name: 'output',
                    type: 'number',
                    examples: [1, 0, 1, 1]
                },
            ]
        });

        (datasetService.extract as jasmine.Spy).and.returnValues(
            {
                input: new PluginData({
                    features: ['feature 1', 'feature 2'],
                    examples: [[1, 1], [2, 2], [3, 3], [4, 4]]
                })
            },
            {
                output: new PluginData({
                    features: ['output'],
                    examples: [[1], [0], [1], [1]]
                })
            }
        );
        (dataService.post as jasmine.Spy).and.returnValue({});

        serviceModel.inputs(1, { output: [0], input: [0]});

        expect(sessionService.delete).toHaveBeenCalledTimes(1);
        expect(sessionService.delete).toHaveBeenCalledWith(1);
        expect(dataService.post).toHaveBeenCalledTimes(1);
        expect(dataService.view).toHaveBeenCalledTimes(1);
        expect(dataService.post).toHaveBeenCalledWith({
            id: 0,
            algorithmId: 1,
            correct: 3,
            total: 4,
            iteration: 1,
            datasetId: 1,
            name: 'Test Report',
            selectedFeatures: [0,1],
            features: [
                {
                    name: 'Expected output',
                    type: 'number',
                    examples: [1, 0, 1, 1]
                },
                {
                    name: 'Actual output',
                    type: 'number',
                    examples: [1, 1, 1, 1]
                },
                {
                    name: 'Correct',
                    type: 'number',
                    examples: [1, 0, 1, 1]
                }
            ]
        });
        expect(algorithmService.stop).toHaveBeenCalledTimes(1);
        expect(algorithmService.stop).toHaveBeenCalledBefore(algorithmService.start as jasmine.Spy);
        expect(algorithmService.start).toHaveBeenCalledTimes(1);
    });


});

