import { TestReportDataService } from "./test-report.data-service";
import { SettingsContext } from "../../contexts/settings-context";
import * as fs from 'fs';
import * as path from 'path';
import * as zlib from 'zlib';
import { ServiceContainer, SERVICE_TYPES } from "../../service-container";
import { AppTestReportDataService } from "./app-test-report.data-service";
import { TestReport } from "../../../../shared/models";
import { TestReportObject } from "../../models";
import { UserSettingDataService } from "../user-setting-data-service";

describe('Electron Test Report Data Service', () => {
    let dataService: TestReportDataService;
    let serviceContainer: ServiceContainer;
    let context: SettingsContext;
    let userSettings: UserSettingDataService;
    const maxId = 100;
    const experimentPath = path.join(__dirname, 'app-test-report-services-folder');

    beforeEach(() => {
        if (!fs.existsSync(experimentPath)) {
            fs.mkdirSync(experimentPath);
        }

        fs.writeFileSync(path.join(experimentPath, `reports1.gzip`), zlib.gzipSync(
            JSON.stringify([
                {
                    id: 1,
                    name: 'test report',
                    algorithmId: 1,
                    datasetId: 1,
                    iteration: 50,
                    correct: 2,
                    total: 3,
                    features: [
                        { name: 'Expected', type: 'number', examples: [1, 0, 1] },
                        { name: 'Actual', type: 'number', examples: [1, 1, 1] },
                        { name: 'Correct', type: 'number', examples: [1, 0, 1] },
                    ],
                    previewExamples: 3
                }
            ])
        ));

        context = jasmine.createSpyObj('SettingsContext', ['get', 'set']);
        (context.get as jasmine.Spy).and.callFake((key) => {
            if (key === 'test-reports') {
                return maxId;
            } else {
                return experimentPath;
            }
        });

        userSettings = jasmine.createSpyObj('UserSettingDataService', ['find']);
        (userSettings.find as jasmine.Spy).and.callFake(() => {
            return {
                value: 1
            };
        });

        serviceContainer = jasmine.createSpyObj('ServiceContainer', ['resolve']);
        (serviceContainer.resolve as jasmine.Spy).and.callFake((type: SERVICE_TYPES) => {
            if (type === SERVICE_TYPES.SettingsContext) {
                return context;
            } else if (type === SERVICE_TYPES.UserSettingDataService) {
                return userSettings;
            }
            throw new Error(`Couldn't resolve type ${type}.`);
        });

        dataService = new AppTestReportDataService(serviceContainer);
        dataService.configure();
    });

    it('all should return length of 0', () => {
        expect(dataService.all().length).toBe(0);
    });

    it('all view should return length of 0', () => {
        expect(dataService.allView().length).toBe(0);
    });

    it('load should increase all by 1', () => {
        dataService.load(1);
        expect(dataService.all().length).toBe(1);
    });

    it('load should increase allView by 1', () => {
        dataService.load(1);
        expect(dataService.all().length).toBe(1);
    });

    it('get should throw for not found', () => {
        expect(() => {
            dataService.get(404);
        }).toThrow();
    });

    it('delete should throw for not found', () => {
        expect(() => {
            dataService.delete(404);
        }).toThrow();
    });

    it('delete should remove test report', () => {
        dataService.load(1);
        dataService.delete(1);
        expect(dataService.all().length).toBe(0);
    });

    it('get should return test report with name', () => {
        dataService.load(1);
        expect(dataService.get(1).name).toBe('test report');
    });

    it('update should throw for not found', () => {
        expect(() => {
            dataService.update({
                id: 404
            } as TestReportObject);
        }).toThrow();
    });

    it('update should change name', () => {
        dataService.load(1);
        const report = dataService.get(1);
        report.name = 'new name';
        dataService.update(report);
        expect(dataService.get(1).name).toBe('new name');
    });

    it('post should return new report with id', () => {
        const report = dataService.post({
            algorithmId: 2,
            correct: 3,
            datasetId: 1,
            id: 0,
            features: [],
            iteration: 0,
            name: 'name',
            total: 1
        });

        expect(report.id).toBe(100);
        expect(context.set).toHaveBeenCalledTimes(1);
    });

    it('delete by algorithm should return ids and remove', () => {
        dataService.load(1);
        const ids = dataService.deleteByAlgorithm(1);
        expect(ids.length).toBe(1);
        expect(dataService.all().length).toBe(0);
    });

    it('delete by algorithm should unlink when save', () => {
        dataService.load(1);
        dataService.deleteByAlgorithm(1);
        dataService.save(1);
        expect(fs.existsSync(path.join(experimentPath, `reports1.gzip`))).toBeFalsy();
    });

    it('save should link new file', () => {
        dataService.post({
            algorithmId: 2,
            correct: 3,
            datasetId: 1,
            features: [],
            id: 0,
            iteration: 0,
            name: 'name',
            total: 1
        });
        dataService.save(2);
        expect(fs.existsSync(path.join(experimentPath, `reports2.gzip`))).toBeTruthy();
    });

    it('view should only show a preview of dataset', () => {
        dataService.load(1);
        const view = dataService.view(1);
        expect(view.id).toBe(1);
        expect(view.algorithmId).toBe(1);
        expect(view.name).toBe('test report');
        expect(view.total).toBe(3);
        expect(view.correct).toBe(2);
        expect(view.iteration).toBe(50);
        expect(view.features.length).toBe(3);
        expect(view.previewExamples.length).toBe(1);
        expect(view.previewExamples[0].length).toBe(3);
    });

    it('show should increase the preview of report', () => {
        dataService.load(1);
        dataService.show(1);
        const report = dataService.get(1);
        expect(report.previewExamples).toBe(2);
    });

    it('show multiple times should increase to length', () => {
        dataService.load(1);
        dataService.show(1);
        dataService.show(1);
        dataService.show(1);
        dataService.show(1);
        dataService.show(1);
        const report = dataService.get(1);
        expect(report.previewExamples).toBe(3);
    });

    it('extract should return two plugin data', () => {
        const id = dataService.post({
            id: 0,
            algorithmId: 2,
            correct: 2,
            datasetId: 1,
            iteration: 1,
            name: 'Test Report',
            total: 2,
            features: [
                { name: 'F1', type: 'number', examples: [1, 2] },
                { name: 'F2', type: 'number', examples: [3, 4] },
                { name: 'F3', type: 'number', examples: [5, 6] },
            ]
        }).id;

        const data = dataService.extract(id, {
            input: [0, 1],
            output: [2]
        }, [0, 1, 2]);


        expect(data.input.features.length).toBe(2);
        expect(data.input.features[0]).toBe('F1');
        expect(data.input.features[1]).toBe('F2');
        expect(data.input.examples.length).toBe(2);
        expect(data.input.examples[0].length).toBe(2);
        expect(data.input.examples[0][0]).toBe(1);
        expect(data.input.examples[0][1]).toBe(3);
        expect(data.input.examples[1][0]).toBe(2);
        expect(data.input.examples[1][1]).toBe(4);
        expect(data.input.examples[1].length).toBe(2);
        expect(data.output.features.length).toBe(1);
        expect(data.output.examples.length).toBe(2);
        expect(data.output.features[0]).toBe('F3');
        expect(data.output.examples.length).toBe(2);
        expect(data.output.examples[0].length).toBe(1);
        expect(data.output.examples[0][0]).toBe(5);
        expect(data.output.examples[1][0]).toBe(6);

    });

});
