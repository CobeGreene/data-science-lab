import { TestReportDataService } from './test-report.data-service';
import { TestReport } from '../../../../shared/models';
import { IdGenerator } from '../../data-structures';
import { SettingsContext } from '../../contexts/settings-context';
import { Service, ServiceContainer, SERVICE_TYPES } from '../../service-container';
import { SystemError, ErrorTypes } from '../../../../shared/errors';
import * as fs from 'fs';
import * as path from 'path';
import * as zlib from 'zlib';
import { TestReportObject } from '../../models';
import { UserSettingDataService } from '../user-setting-data-service';
import { Settings } from '../../../../shared/settings';
import { PluginData } from 'data-science-lab-core';

export class AppTestReportDataService extends Service implements TestReportDataService {

    private readonly key = 'test-reports';
    private readonly path = 'test-reports-path';

    private reports: TestReportObject[];
    private idGenerator: IdGenerator;

    get settings(): SettingsContext {
        return this.serviceContainer.resolve<SettingsContext>(SERVICE_TYPES.SettingsContext);
    }

    get user(): UserSettingDataService {
        return this.serviceContainer.resolve<UserSettingDataService>(SERVICE_TYPES.UserSettingDataService);
    }

    constructor(serviceContainer: ServiceContainer) {
        super(serviceContainer);

        this.reports = [];
        this.idGenerator = new IdGenerator();
    }

    configure() {
        const id = this.settings.get<number>(this.key, 1);
        this.idGenerator = new IdGenerator(id);
    }

    all();
    all(algorithmId: number);
    all(algorithmId?: number) {
        if (algorithmId === undefined) {
            return this.reports;
        }
        return this.reports.filter(value => value.algorithmId === algorithmId);
    }

    allView(): TestReport[] {
        return this.reports.map(value => this.toView(value));
    }

    view(id: number): TestReport {
        const obj = this.get(id);
        return this.toView(obj);
    }

    show(id: number): void {
        const report = this.get(id);

        const setting = this.user.find(Settings.TestReportDefaultPreview);
        const defaultPreview = (setting === undefined) ? 10 : setting.value;

        if (report.previewExamples + defaultPreview > report.total) {
            report.previewExamples = report.total;
        } else {
            report.previewExamples = report.previewExamples + defaultPreview;
        }

        this.update(report);
    }

    toView(report: TestReportObject): TestReport {
        const features = report.features.map(value => ({
            name: value.name,
            type: value.type
        }));

        const previewExamples: any[][] = [];

        for (let example = 0; example < report.previewExamples; ++example) {
            previewExamples.push([]);
            for (const feature of report.features) {
                previewExamples[example].push(feature.examples[example]);
            }
        }

        return {
            id: report.id,
            algorithmId: report.algorithmId,
            name: report.name,
            correct: report.correct,
            datasetId: report.datasetId,
            iteration: report.iteration,
            total: report.total,
            features,
            previewExamples
        }
    }

    delete(id: number) {
        const find = this.reports.findIndex(value => value.id === id);
        if (find >= 0) {
            this.reports.splice(find, 1);
        } else {
            throw this.notFound(id);
        }
    }

    get(id: number) {
        const find = this.reports.find(value => value.id === id);
        if (find === undefined) {
            throw this.notFound(id);
        }
        return find;
    }

    update(report: TestReportObject) {
        const find = this.reports.findIndex(value => value.id === report.id);
        if (find >= 0) {
            this.reports.splice(find, 1, report);
        } else {
            throw this.notFound(report.id);
        }
    }

    load(algorithmId: number) {
        const dirPath = this.settings.get<string>(this.path);
        const reportPath = path.join(dirPath, `reports${algorithmId}.gzip`);
        if (fs.existsSync(reportPath)) {
            const buffer = fs.readFileSync(reportPath);
            const reports = JSON.parse(`${zlib.unzipSync(buffer)}`) as TestReportObject[];
            reports.forEach((value) => {
                value.previewExamples = this.initialPreview(value.total);
            })
            this.reports.push(...reports);
        }
    }

    save(algorithmId: number) {
        const reports = this.reports.filter(value => value.algorithmId === algorithmId);
        const dirPath = this.settings.get<string>(this.path);
        const reportPath = path.join(dirPath, `reports${algorithmId}.gzip`);
        if (reports.length > 0) {
            const buffer = zlib.gzipSync(JSON.stringify(reports));
            fs.writeFileSync(reportPath, buffer);
        } else if (fs.existsSync(reportPath)) {
            fs.unlinkSync(reportPath);
        }
    }

    saveGenerator() {
        this.settings.set(this.key, this.idGenerator.at());
    }

    post(report: TestReportObject) {
        report.id = this.idGenerator.next();

        report.previewExamples = this.initialPreview(report.total);

        this.reports.push(report);
        this.saveGenerator();
        return report;
    }

    initialPreview(examples: number) {
        const setting = this.user.find(Settings.TestReportDefaultPreview);
        const defaultPreview = (setting === undefined) ? 10 : setting.value;
        return (defaultPreview < examples) ? defaultPreview : examples;
    }

    deleteByAlgorithm(algorithmId: number): number[] {
        const ids = this.reports.filter(value => value.algorithmId === algorithmId).map(value => value.id);
        this.reports = this.reports.filter(value => value.algorithmId !== algorithmId);
        return ids;
    }

    extract(id: number, inputs: { [id: string]: number[] }, selectedFeatures: number[]): { [id: string]: PluginData } {
        const data: { [id: string]: PluginData } = {};

        const report = this.get(id);

        for (const key in inputs) {
            if (inputs[key] === undefined) {
                continue;
            }

            const features: string[] = [];
            const examples: any[][] = [];

            for (let i = 0; i < report.total; ++i) {
                examples.push([]);
                for (const _ of inputs[key]) {
                    examples[i].push(undefined);
                }
            }

            for (let j = 0; j < inputs[key].length; ++j) {
                features.push(report.features[selectedFeatures[inputs[key][j]]].name);
                for (let i = 0; i < report.features[selectedFeatures[inputs[key][j]]].examples.length; ++i) {
                    examples[i][j] = report.features[selectedFeatures[inputs[key][j]]].examples[i];
                }
            }

            data[key] = new PluginData({
                features,
                examples
            });
        }

        return data;
    }

    notFound(id: number): SystemError {
        return {
            header: 'Test Report Error',
            description: `Couldn't find test report with id ${id}`,
            type: ErrorTypes.Warning
        };
    }

}
