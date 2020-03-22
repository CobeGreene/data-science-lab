import { ServiceContainer, SERVICE_TYPES, Service } from '../../service-container';
import { DatasetDataService } from './dataset.data-service';
import { PluginData } from 'data-science-lab-core';
import { DatasetObject, FeatureObject } from '../../models';
import { Dataset, Feature, } from '../../../../shared/models';
import { Settings } from '../../../../shared/settings';
import { SettingsContext } from '../../contexts/settings-context';
import { UserSettingDataService } from '../../data-services/user-setting-data-service';
import { IdGenerator } from '../../data-structures';
import { SystemError, ErrorTypes } from '../../../../shared/errors';
import { PluginDataConverter } from '../../converters/plugin-data-converter/plugin-data.converter';
import * as fs from 'fs';
import * as path from 'path';
import * as zlib from 'zlib';

export class AppDatasetDataService extends Service implements DatasetDataService {
    private readonly key = 'datasets';
    private readonly path = 'datasets-path';

    private datasets: DatasetObject[];
    private idGenerator: IdGenerator;

    get context(): SettingsContext {
        return this.serviceContainer.resolve<SettingsContext>(SERVICE_TYPES.SettingsContext);
    }

    get user(): UserSettingDataService {
        return this.serviceContainer.resolve<UserSettingDataService>(SERVICE_TYPES.UserSettingDataService);
    }

    get converter(): PluginDataConverter {
        return this.serviceContainer.resolve<PluginDataConverter>(SERVICE_TYPES.PluginDataConverter);
    }

    constructor(serviceContainer: ServiceContainer) {
        super(serviceContainer);

        this.datasets = [];
        this.idGenerator = new IdGenerator();
    }

    configure() {
        const id = this.context.get<number>(this.key, 1);
        this.idGenerator = new IdGenerator(id);
    }

    all(): DatasetObject[];
    // tslint:disable-next-line: unified-signatures
    all(experimentId: number): DatasetObject[];
    all(experimentId?: number): DatasetObject[] {
        if (experimentId === undefined) {
            return this.datasets;
        }
        return this.datasets.filter((value) => value.experimentId === experimentId);
    }

    create(experimentId: number, data: PluginData): number[] {
        const datasets = this.converter.convert(data);

        const setting = this.user.find(Settings.DatasetDefaultPreview);
        const defaultPreview = (setting === undefined) ? 10 : setting.value;

        datasets.forEach((value) => {
            value.id = this.idGenerator.next();
            value.experimentId = experimentId;
            value.previewExamples = (defaultPreview < value.examples) ? defaultPreview : value.examples;
        });

        this.datasets.push(...datasets);

        this.saveGenerator();
        return datasets.map(value => value.id);
    }

    load(experimentId: number): void {
        const datasetPath = this.context.get<string>(this.path);
        const experimentPath = path.join(datasetPath, `datasets${experimentId}.gzip`);
        if (fs.existsSync(experimentPath)) {
            const setting = this.user.find(Settings.DatasetDefaultPreview);
            const defaultPreview = (setting === undefined) ? 10 : setting.value;

            const buffer = fs.readFileSync(experimentPath);
            const datasets = JSON.parse(`${zlib.unzipSync(buffer)}`);
            datasets.forEach((value) => {
                const dataset: DatasetObject = {
                    id: value.id,
                    name: value.name,
                    examples: value.examples,
                    experimentId: value.experimentId,
                    previewExamples: defaultPreview,
                    features: (value.features as Array<any>).map((feature) => ({
                        name: feature.name,
                        type: feature.type,
                        examples: feature.examples
                    }))
                };
                this.datasets.push(dataset);
            });
        }
    }

    save(experimentId: number): void {
        const datasets = this.all(experimentId);
        const datasetPath = this.context.get<string>(this.path);
        const experimentPath = path.join(datasetPath, `datasets${experimentId}.gzip`);

        if (datasets.length > 0) {
            const buffer = zlib.gzipSync(JSON.stringify(datasets));
            fs.writeFileSync(experimentPath, buffer);
        } else if (fs.existsSync(experimentPath)) {
            fs.unlinkSync(experimentPath);
        }

    }

    get(id: number): DatasetObject {
        const find = this.datasets.find(value => value.id === id);
        if (find === undefined) {
            throw this.notFound(id);
        }
        return find;
    }

    delete(id: number): void {
        const find = this.datasets.findIndex(value => value.id === id);
        if (find >= 0) {
            this.datasets.splice(find, 1);
        } else {
            throw this.notFound(id);
        }
    }

    deleteByExperiment(experimentId: number) {
        const ids = this.all(experimentId).map(value => value.id);
        ids.forEach(id => this.delete(id));
        return ids;
    }

    view(id: number): Dataset {
        const obj = this.get(id);
        const features = obj.features.map(value => ({
            name: value.name,
            type: value.type
        }));

        const previewExamples: any[][] = [];

        for (let example = 0; example < obj.previewExamples; ++example) {
            previewExamples.push([]);
            for (const feature of obj.features) {
                previewExamples[example].push(feature.examples[example]);
            }
        }

        return {
            id,
            experimentId: obj.experimentId,
            name: obj.name,
            examples: obj.examples,
            features,
            previewExamples
        };
    }

    saveGenerator() {
        this.context.set(this.key, this.idGenerator.at());
    }

    notFound(id: number): SystemError {
        return {
            header: 'Dataset Error',
            description: `Couldn't find dataset with id ${id}`,
            type: ErrorTypes.Error
        };
    }

    update(dataset: DatasetObject) {
        const find = this.datasets.findIndex(value => value.id === dataset.id);
        if (find < 0) {
            throw this.notFound(dataset.id);
        }
        this.datasets.splice(find, 1, dataset);
    }

    split(id: number, split: number): number {
        const dataset = this.get(id);
        const setting = this.user.find(Settings.DatasetDefaultPreview);
        const defaultPreview = (setting === undefined) ? 10 : setting.value;

        const features: FeatureObject[] = [];
        for (const feature of dataset.features) {
            features.push({
                name: feature.name,
                type: feature.type,
                examples: feature.examples.splice(split, dataset.examples - split)
            });
        }

        const splitDataset: DatasetObject = {
            id: this.idGenerator.next(),
            experimentId: dataset.experimentId,
            name: `${dataset.name} (Split)`,
            previewExamples: defaultPreview,
            examples: dataset.examples - split,
            features
        };

        this.datasets.push(splitDataset);
        dataset.examples = split;
        this.update(dataset);
        this.saveGenerator();
        return splitDataset.id;
    }

    join(ids: number[]): { updateId: number, deletedIds: number[] } {
        if (ids.length < 2) {
            throw this.unableToJoin(ids);
        }
        const original = this.get(ids[0]);
        const dataset: DatasetObject = {
            id: original.id,
            experimentId: original.experimentId,
            examples: original.examples,
            name: original.name,
            previewExamples: original.previewExamples,
            features: this.sortFeatures(original.features.slice())
        };

        for (const id of ids.slice(1)) {
            const next = this.get(id);
            const features = this.sortFeatures(next.features);
            if (dataset.features.length !== features.length) {
                throw this.joinFailWrapper(dataset, ids);
            }
            for (let i = 0; i < features.length; ++i) {
                if (dataset.features[i].name !== features[i].name) {
                    throw this.joinFailWrapper(dataset, ids);
                } else if (dataset.features[i].type !== features[i].type) {
                    throw this.joinFailWrapper(dataset, ids);
                }
                dataset.features[i].examples.push(...features[i].examples.slice());
            }
            dataset.examples += next.examples;
        }

        this.update(dataset);
        ids.slice(1).forEach((id) => this.delete(id));
        return { updateId: ids[0], deletedIds: ids.slice(1) };
    }

    joinFailWrapper(dataset: DatasetObject, ids: number[]) {
        delete dataset.features;
        return this.unableToJoin(ids);
    }

    unableToJoin(ids: number[]): SystemError {
        return {
            header: 'Dataset Join Error',
            description: `Unable to join dataset for the following ids: ${ids.join(', ')}`,
            type: ErrorTypes.Error
        };
    }

    sortFeatures(features: FeatureObject[]): FeatureObject[] {
        return features.sort((lhs: FeatureObject, rhs: FeatureObject) => {
            if (lhs.name < rhs.name) {
                return -1;
            }
            if (lhs.name > rhs.name) {
                return 1;
            }
            return 0;
        });
    }

    show(id: number): void {
        const dataset = this.get(id);

        const setting = this.user.find(Settings.DatasetDefaultPreview);
        const defaultPreview = (setting === undefined) ? 10 : setting.value;

        if (dataset.previewExamples + defaultPreview > dataset.examples) {
            dataset.previewExamples = dataset.examples;
        } else {
            dataset.previewExamples = dataset.previewExamples + defaultPreview;
        }

        this.update(dataset);
    }

    extract(id: number, inputs: { [id: string]: number[] }, selectedFeatures: number[]): { [id: string]: PluginData } {
        const data: { [id: string]: PluginData } = {};

        const dataset = this.get(id);

        for (const key in inputs) {
            if (inputs[key] === undefined) {
                continue;
            }

            const features: string[] = [];
            const examples: any[][] = [];

            for (let i = 0; i < dataset.examples; ++i) {
                examples.push([]);
                for (const _ of inputs[key]) {
                    examples[i].push(undefined);
                }
            }

            for (let j = 0; j < inputs[key].length; ++j) {
                features.push(dataset.features[selectedFeatures[inputs[key][j]]].name);
                for (let i = 0; i < dataset.features[selectedFeatures[inputs[key][j]]].examples.length; ++i) {
                    examples[i][j] = dataset.features[selectedFeatures[inputs[key][j]]].examples[i];
                }
            }

            data[key] = new PluginData({
                features,
                examples
            });
        }

        return data;
    }

    transform(id: number, pluginData: PluginData[] | PluginData, features: number[]): { updateId: number, createIds: number[] } {
        const current = this.get(id);

        if (!(pluginData instanceof Array)) {
            pluginData = [pluginData];
        }

        const setting = this.user.find(Settings.DatasetDefaultPreview);
        const defaultPreview = (setting === undefined) ? 10 : setting.value;
        const datasets: DatasetObject[] = [].concat(...pluginData.map(value => this.converter.convert(value)));

        const newDatasets: DatasetObject[] = [];
        const indicesToRemove: number[] = [];

        for (const dataset of datasets) {
            const possible: DatasetObject = {
                name: dataset.name,
                experimentId: current.experimentId,
                examples: dataset.examples,
                features: [],
                id: 0,
                previewExamples: defaultPreview
            };

            for (const feature of dataset.features) {
                let inCurrent = false;
                let indexOfCurrent = -1;

                for (let j = 0; j < features.length; ++j) {
                    if (current.features[features[j]].name === feature.name) {
                        indexOfCurrent = j;
                        inCurrent = true;
                        break;
                    }
                }
                // in current
                if (inCurrent) {
                    // if the dataset example is the same size we keep it.
                    if (dataset.examples === current.examples) {
                        current.features.splice(features[indexOfCurrent], 1, feature);
                    } else {
                        // else we remove from current and create a new dataset
                        indicesToRemove.push(features[indexOfCurrent]);
                        features.splice(indexOfCurrent, 1);
                        possible.features.push(feature);
                    }
                } else {
                    // if the dataset is the same as current we add feature
                    if (dataset.examples === current.examples) {
                        current.features.push(feature);
                    } else {
                        // else we create new dataset.
                        possible.features.push(feature);
                    }
                }
            }

            if (possible.features.length > 0) {
                newDatasets.push(possible);
            }
        }

        current.features = current.features.filter((x, i) => indicesToRemove.indexOf(i) === -1);


        this.update(current);
        const createIds: number[] = [];

        newDatasets.forEach((value) => {
            value.id = this.idGenerator.next();
            createIds.push(value.id);
        });

        this.datasets.push(...newDatasets);

        this.saveGenerator();
        return { updateId: current.id, createIds };
    }



}



