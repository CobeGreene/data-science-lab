import { SERVICE_TYPES, ServiceContainer, Service } from '../../service-container';
import { VisualDataService } from './visual.data-service';
import { Visual } from '../../../../shared/models';
import { SettingsContext } from '../../contexts/settings-context';
import { IdGenerator } from '../../data-structures';
import { ErrorTypes } from '../../../../shared/errors';
import * as fs from 'fs';
import * as path from 'path';
import * as zlib from 'zlib';


export class AppVisualDataService extends Service implements VisualDataService {
    private readonly key = 'visuals';
    private readonly path = 'visuals-path';

    private visuals: Visual[];
    private idGenerator: IdGenerator;

    get context(): SettingsContext {
        return this.serviceContainer.resolve<SettingsContext>(SERVICE_TYPES.SettingsContext);
    }

    constructor(serviceContainer: ServiceContainer) {
        super(serviceContainer);

        this.visuals = [];
        this.idGenerator = new IdGenerator();
    }

    configure() {
        const id = this.context.get<number>(this.key, 1);
        this.idGenerator = new IdGenerator(id);
    }

    all(): Visual[];
    // tslint:disable-next-line: unified-signatures
    all(experimentId: number): Visual[];
    all(experimentId?: number): Visual[] {
        if (experimentId === undefined) {
            return this.visuals;
        }
        return this.visuals.filter((value) => value.experimentId === experimentId);
    }

    get(id: number): Visual {
        const find = this.visuals.find(value => value.id === id);
        if (find === undefined) {
            throw this.notFound(id);
        }
        return find;
    }

    delete(id: number) {
        const find = this.visuals.findIndex(value => value.id === id);
        if (find >= 0) {
            this.visuals.splice(find, 1);
        } else {
            throw this.notFound(id);
        }
    }

    deleteByExperiment(experimentId: number) {

    }

    update(visual: Visual) {
        const find = this.visuals.findIndex(value => value.id === visual.id);
        if (find >= 0) {
            this.visuals.splice(find, 1, visual);
        } else {
            throw this.notFound(visual.id);
        }
    }

    post(visual: Visual) {
        visual.id = this.idGenerator.next();
        this.visuals.push(visual);
        this.saveGenerator();
        return visual;
    }

    load(experimentId: number) {
        const dirPath = this.context.get<string>(this.path);
        const visualPath = path.join(dirPath, `visuals${experimentId}.gzip`);
        if (fs.existsSync(visualPath)) {
            const buffer = fs.readFileSync(visualPath);
            const visuals = JSON.parse(`${zlib.unzipSync(buffer)}`);
            this.visuals.push(...visuals);
        }
    }

    save(experimentId: number) {
        const visuals = this.all(experimentId);
        if (visuals.length > 0) {
            const dirPath = this.context.get<string>(this.path);
            const visualPath = path.join(dirPath, `visuals${experimentId}.gzip`);
            const buffer = zlib.gzipSync(JSON.stringify(visuals));
            fs.writeFileSync(visualPath, buffer);   
        }
    }

    saveGenerator() {
        this.context.set(this.key, this.idGenerator.at());
    }

    notFound(id: number) {
        return {
            header: 'Visual Error',
            description: `Couldn't find visual with id ${id}`,
            type: ErrorTypes.Error
        };
    }
}


