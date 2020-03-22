import { AlgorithmObject, AlgorithmData } from '../../models';
import { Algorithm, Package, Plugin } from '../../../../shared/models';
import { ServiceContainer, SERVICE_TYPES, Service } from '../../service-container';
import { AlgorithmDataService } from './algorithm.data-service';
import { PluginData, AlgorithmPlugin } from 'data-science-lab-core';
import { SettingsContext } from '../../contexts/settings-context';
import { UserSettingDataService } from '../../data-services/user-setting-data-service';
import { PackageDataService } from '../../data-services/package-data-service';
import { IdGenerator } from '../../data-structures';
import { SystemError, ErrorTypes } from '../../../../shared/errors';
import { AlgorithmEvents } from '../../../../shared/events';
import * as fs from 'fs';
import * as path from 'path';
import * as zlib from 'zlib';
import { PluginContext } from '../../contexts/plugin-context';
import { Settings } from '../../../../shared/settings';
import { AlgorithmRecorderService } from '../../core-services/recorder-service';
import { Producer } from '../../pipeline';

export class AppAlgorithmDataService extends Service implements AlgorithmDataService {
    private readonly key = 'algorithms';
    private readonly path = 'algorithms-path';

    private algorithms: AlgorithmObject[];
    private idGenerator: IdGenerator;

    get settings(): SettingsContext {
        return this.serviceContainer.resolve<SettingsContext>(SERVICE_TYPES.SettingsContext);
    }

    get user(): UserSettingDataService {
        return this.serviceContainer.resolve<UserSettingDataService>(SERVICE_TYPES.UserSettingDataService);
    }

    get context(): PluginContext {
        return this.serviceContainer.resolve<PluginContext>(SERVICE_TYPES.PluginContext);
    }

    get dataService(): PackageDataService {
        return this.serviceContainer.resolve<PackageDataService>(SERVICE_TYPES.PackageDataService);
    }

    get producer(): Producer {
        return this.serviceContainer.resolve<Producer>(SERVICE_TYPES.Producer);
    }

    recorder(id: number, iteration: number): AlgorithmRecorderService {
        return this.serviceContainer.resolve<AlgorithmRecorderService>(SERVICE_TYPES.RecorderService, id, iteration);
    }

    constructor(serviceContainer: ServiceContainer) {
        super(serviceContainer);

        this.algorithms = [];
        this.idGenerator = new IdGenerator();
    }

    configure() {
        const id = this.settings.get<number>(this.key, 1);
        this.idGenerator = new IdGenerator(id);
    }

    all(): AlgorithmObject[];
    // tslint:disable-next-line: unified-signatures
    all(experimentId: number): AlgorithmObject[];
    all(experimentId?: number): AlgorithmObject[] {
        if (experimentId === undefined) {
            return this.algorithms;
        }
        return this.algorithms.filter((value) => value.experimentId === experimentId);
    }

    allView(): Algorithm[] {
        return this.algorithms.map(value => this.toView(value));
    }

    get(id: number): AlgorithmObject {
        const find = this.algorithms.find(value => value.id === id);
        if (find === undefined) {
            throw this.notFound(id);
        }
        return find;
    }

    create(experimentId: number, plugin: Plugin, algorithm: AlgorithmPlugin): number {
        const setting = this.user.find(Settings.AlgorithmDefaultTime);
        const defaultTime = (setting === undefined) ? 200 : setting.value;

        const obj: AlgorithmObject = {
            id: this.idGenerator.next(),
            experimentId,
            isFinish: algorithm.finishTraining(),
            isTraining: false,
            iteration: 0,
            algorithm,
            name: `New Algorithm`,
            plugin,
            iterationTime: defaultTime,
        };

        this.algorithms.push(obj);
        
        this.saveGenerator();
        return obj.id;
    }

    saveGenerator() {
        this.settings.set(this.key, this.idGenerator.at());
    }

    view(id: number): Algorithm {
        const algorithm = this.get(id);
        return this.toView(algorithm);
    }

    toView(algorithm: AlgorithmObject): Algorithm {
        return {
            id: algorithm.id,
            experimentId: algorithm.experimentId,
            isFinish: algorithm.isFinish,
            isTraining: algorithm.isTraining,
            iteration: algorithm.iteration,
            iterationTime: algorithm.iterationTime,
            name: algorithm.name
        };
    }

    async delete(id: number): Promise<number> {
        const find = this.algorithms.findIndex(value => value.id === id);
        if (find >= 0) {
            const obj = this.algorithms[find];
            if (obj.trainer !== undefined) {
                clearInterval(obj.trainer);
            }
            await this.context.deactivate(this.dataService.find(obj.plugin), obj.plugin);
            this.algorithms.splice(find, 1);
            return id;
        } else {
            throw this.notFound(id);
        }
    }

    async deleteByExperiment(experimentId: number): Promise<number[]> {
        const ids = this.all(experimentId).map(value => value.id);
        for (const id of ids) {
            await this.delete(id);
        }
        return ids;
    }

    async load(experimentId: number) {
        const algorithmPath = this.settings.get<string>(this.path);
        const experimentPath = path.join(algorithmPath, `algorithms${experimentId}`);
        if (fs.existsSync(experimentPath)) {
            const buffer = fs.readFileSync(experimentPath);
            const data: AlgorithmData[] = JSON.parse(`${zlib.unzipSync(buffer)}`);
            for (const datum of data) {
                const algorithmPlugin = await this.context.activate<AlgorithmPlugin>(this.dataService.find(datum.plugin), datum.plugin);
                const algorithm = algorithmPlugin.import(datum.algorithm);
                const obj: AlgorithmObject = {
                    id: datum.id,
                    name: datum.name,
                    experimentId: datum.experimentId,
                    isTraining: false,
                    isFinish: datum.isFinish,
                    iteration: datum.iteration,
                    plugin: datum.plugin,
                    algorithm,
                    iterationTime: datum.iterationTime,
                };
                this.algorithms.push(obj);
            }
        }
    }

    save(experimentId: number) {
        const algorithms = this.all(experimentId);
        const algorithmPath = this.settings.get<string>(this.path);
        const experimentPath = path.join(algorithmPath, `algorithms${experimentId}`);

        if (algorithms.length > 0) {
            const data: AlgorithmData[] = algorithms.map((value): AlgorithmData => {
                return {
                    id: value.id,
                    name: value.name,
                    experimentId: value.experimentId,
                    isFinish: value.isFinish,
                    iteration: value.iteration,
                    iterationTime: value.iterationTime,
                    plugin: value.plugin,
                    algorithm: value.algorithm.export()
                };
            });
            const buffer = zlib.gzipSync(JSON.stringify(data));
            fs.writeFileSync(experimentPath, buffer);
        } else if (fs.existsSync(experimentPath)) {
            fs.unlinkSync(experimentPath);
        }
    }

    update(algorithm: AlgorithmObject) {
        const find = this.algorithms.findIndex(value => value.id === algorithm.id);
        if (find < 0) {
            throw this.notFound(algorithm.id);
        }
        this.algorithms.splice(find, 1, algorithm);
    }

    start(id: number) {
        const algorithmObject = this.get(id);
        if (algorithmObject.isTraining) {
            throw this.alreadyTraining(algorithmObject.name);
        }

        if (algorithmObject.isFinish) {
            throw this.finishTraining(algorithmObject.name);
        }

        const recorder = this.recorder(algorithmObject.id, algorithmObject.iteration);
        algorithmObject.recorder = recorder;
        algorithmObject.isTraining = true;
        algorithmObject.algorithm.setRecorderService(recorder);
        algorithmObject.trainer = setInterval(() => {
            this.step(algorithmObject);
        }, algorithmObject.iterationTime);

        this.update(algorithmObject);
    }

    step(obj: AlgorithmObject) {
        ++obj.iteration;
        obj.recorder.current(obj.iteration);
        obj.algorithm.step();
        if (obj.algorithm.finishTraining()) {
            obj.isFinish = true;
            obj.isTraining = false;
            clearInterval(obj.trainer);
            obj.trainer = undefined;
        }

        this.update(obj);
        this.producer.send(AlgorithmEvents.Change, obj.id);
    }

    stop(id: number) {
        const algorithmObject = this.get(id);
        if (!algorithmObject.isTraining) {
            throw this.notTraining(algorithmObject.name);
        }

        algorithmObject.isTraining = false;
        clearInterval(algorithmObject.trainer);
        algorithmObject.trainer = undefined;

        this.update(algorithmObject);
    }


    notFound(id: number): SystemError {
        return {
            header: 'Algorithm Error',
            description: `Couldn't find algorithm with id ${id}`,
            type: ErrorTypes.Error
        };
    }

    alreadyTraining(name: string): SystemError {
        return {
            header: 'Algorithm Error',
            description: `Algorithm ${name} is already in trainings`,
            type: ErrorTypes.Warning
        };
    }

    finishTraining(name: string): SystemError {
        return {
            header: 'Algorithm Error',
            description: `Algorithm ${name} is finish training`,
            type: ErrorTypes.Warning
        };
    }

    notTraining(name: string): SystemError {
        return {
            header: 'Algorithm Error',
            description: `Algorithm ${name} is not currently training.`,
            type: ErrorTypes.Error
        };
    }
}

