import { TestReportDataService } from "./test-report.data-service";
import { SettingsContext } from "../../contexts/settings-context";
import * as fs from 'fs';
import * as path from 'path';
import * as zlib from 'zlib';
import { ServiceContainer, SERVICE_TYPES } from "../../service-container";
import { AppTestReportDataService } from "./app-test-report.data-service";
import { TestReport } from "../../../../shared/models";

describe('Electron Test Report Data Service', () => {
    let dataService: TestReportDataService;
    let serviceContainer: ServiceContainer;
    let context: SettingsContext;
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
                    datasetName: 'dataset',
                    correct: 10,
                    total: 100,
                    iteration: 50
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

        serviceContainer = jasmine.createSpyObj('ServiceContainer', ['resolve']);
        (serviceContainer.resolve as jasmine.Spy).and.callFake((type: SERVICE_TYPES) => {
            if (type === SERVICE_TYPES.SettingsContext) {
                return context;
            }
            throw new Error(`Couldn't resolve type ${type}.`);
        });

        dataService = new AppTestReportDataService(serviceContainer);
        dataService.configure();
    });

    it('all should return length of 0', () => {
        expect(dataService.all().length).toBe(0);
    }); 

    it('load should increase all by 1', () => {
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
            } as TestReport);
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
            datasetName: 'name',
            id: 0,
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
            datasetName: 'name',
            id: 0,
            iteration: 0,
            name: 'name',
            total: 1
        });
        dataService.save(2);
        expect(fs.existsSync(path.join(experimentPath, `reports2.gzip`))).toBeTruthy();
    });

});
