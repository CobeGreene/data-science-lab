import { TestReportDataService } from './test-report.data-service';
import { TestReport } from '../../../../shared/models';
import { IdGenerator } from '../../data-structures';
import { SettingsContext } from '../../contexts/settings-context';
import { Service, ServiceContainer, SERVICE_TYPES } from '../../service-container';
import { SystemError, ErrorTypes } from '../../../../shared/errors';
import * as fs from 'fs';
import * as path from 'path';
import * as zlib from 'zlib';

export class AppTestReportDataService extends Service implements TestReportDataService {

    private readonly key = 'test-reports';
    private readonly path = 'test-reports-path';

    private reports: TestReport[];
    private idGenerator: IdGenerator;

    get settings(): SettingsContext {
        return this.serviceContainer.resolve<SettingsContext>(SERVICE_TYPES.SettingsContext);
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

    all() {
        return this.reports;
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

    update(report: TestReport) {
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
            const reports = JSON.parse(`${zlib.unzipSync(buffer)}`);
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

    post(report: TestReport) {
        report.id = this.idGenerator.next();
        this.reports.push(report);
        this.saveGenerator();
        return report;
    }

    deleteByAlgorithm(algorithmId: number) {
        this.reports = this.reports.filter(value => value.algorithmId === algorithmId);
    }

    notFound(id: number): SystemError {
        return {
            header: 'Test Report Error',
            description: `Couldn't find test report with id ${id}`,
            type: ErrorTypes.Warning
        };
    }

}
