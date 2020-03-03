import { DatasetDataService } from './dataset.data-service';
import { SettingsContext } from '../../contexts/settings-context';
import { ServiceContainer, SERVICE_TYPES } from '../../service-container';
import { UserSettingDataService } from '../user-setting-data-service';
import { PluginDataConverter } from '../../converters/plugin-data-converter/plugin-data.converter';
import { AppDatasetDataService } from './app-dataset.data-service';
import * as fs from 'fs';
import * as path from 'path';
import * as zlib from 'zlib';

describe('Electron Dataset Data Service', () => {
    let datasetService: DatasetDataService;
    let context: SettingsContext;
    let serviceContainer: ServiceContainer;
    let userSettings: UserSettingDataService;
    let pluginConverter: PluginDataConverter;
    const maxId = 100;
    const experimentPath = path.join(__dirname, 'app-dataset-services-folder');

    beforeEach(() => {
        if (!fs.existsSync(experimentPath)) {
            fs.mkdirSync(experimentPath);
        }

        fs.writeFileSync(path.join(experimentPath, `datasets${1}.gzip`), zlib.gzipSync(
            JSON.stringify([
                {
                    id: 1,
                    experimentId: 1,
                    name: 'Name1',
                    examples: 3,
                    features: [
                        { name: 'F1', type: 'number', examples: [1, 2, 3] },
                        { name: 'F2', type: 'number', examples: [1, 2, 3] },
                        { name: 'F3', type: 'number', examples: [1, 2, 3] },
                    ],
                },
                {
                    id: 2,
                    experimentId: 1,
                    name: 'Name2',
                    examples: 3,
                    features: [
                        { name: 'F1', type: 'number', examples: [1, 2, 3] },
                        { name: 'F2', type: 'number', examples: [1, 2, 3] },
                        { name: 'F3', type: 'number', examples: [1, 2, 3] },
                    ],
                }
            ])
        ));

        context = jasmine.createSpyObj('SettingsContext', ['get', 'set']);
        (context.get as jasmine.Spy).and.callFake((key) => {
            if (key === 'datasets') {
                return maxId;
            } else {
                return experimentPath;
            }
        });

        serviceContainer = jasmine.createSpyObj('ServiceContainer', ['resolve']);
        (serviceContainer.resolve as jasmine.Spy).and.callFake((type: SERVICE_TYPES) => {
            if (type === SERVICE_TYPES.SettingsContext) {
                return context;
            } else if (type === SERVICE_TYPES.UserSettingDataService) {
                return userSettings;
            } else if (type === SERVICE_TYPES.PluginDataConverter) {
                return pluginConverter;
            }
            throw new Error(`Couldn't resolve type ${type}.`);
        });

        userSettings = jasmine.createSpyObj('UserSettingDataService', ['find']);
        (userSettings.find as jasmine.Spy).and.callFake(() => {
            return {
                value: 1
            };
        });

        pluginConverter = jasmine.createSpyObj('PluginDataConverter', ['convert']);

        datasetService = new AppDatasetDataService(serviceContainer);
        datasetService.configure();
    });

    it('all should return length of 0', () => {
        expect(datasetService.all().length).toBe(0);
    });

    it('load should increase all by 2', () => {
        datasetService.load(1);
        expect(datasetService.all(1).length).toBe(2);
    });

    it('create should return ids of new dataset', () => {
        (pluginConverter.convert as jasmine.Spy).and.callFake(() => {
            return [
                {
                    id: 0,
                    experimentId: 0,
                    name: 'New Dataset',
                    examples: 3,
                    features: [
                        { name: 'F1', type: 'number', examples: [1, 2, 3] },
                        { name: 'F2', type: 'number', examples: [1, 2, 3] },
                        { name: 'F3', type: 'number', examples: [1, 2, 3] },
                    ],
                },
                {
                    id: 0,
                    experimentId: 0,
                    name: 'New Dataset 2',
                    examples: 3,
                    features: [
                        { name: 'F1', type: 'number', examples: [1, 2, 3] },
                        { name: 'F2', type: 'number', examples: [1, 2, 3] },
                        { name: 'F3', type: 'number', examples: [1, 2, 3] },
                    ],
                }
            ];
        });

        const ids = datasetService.create(2, { examples: [], features: [] });

        expect(ids.length).toBe(2);
        expect(ids[0]).toBe(100);
        expect(ids[1]).toBe(101);
        expect(context.set).toHaveBeenCalledTimes(1);
    });

    it('create should return id I can get', () => {
        (pluginConverter.convert as jasmine.Spy).and.callFake(() => {
            return [
                {
                    id: 0,
                    experimentId: 0,
                    name: 'New Dataset',
                    examples: 3,
                    features: [
                        { name: 'F1', type: 'number', examples: [1, 2, 3] },
                        { name: 'F2', type: 'number', examples: [1, 2, 3] },
                        { name: 'F3', type: 'number', examples: [1, 2, 3] },
                    ],
                }
            ];
        });
        const ids = datasetService.create(2, { examples: [], features: [] });

        const dataset = datasetService.get(ids[0]);

        expect(dataset.experimentId).toBe(2);
    });

    it('create and save should create new zip in folder', () => {
        (pluginConverter.convert as jasmine.Spy).and.callFake(() => {
            return [
                {
                    id: 0,
                    experimentId: 0,
                    name: 'New Dataset',
                    examples: 3,
                    features: [
                        { name: 'F1', type: 'number', examples: [1, 2, 3] },
                        { name: 'F2', type: 'number', examples: [1, 2, 3] },
                        { name: 'F3', type: 'number', examples: [1, 2, 3] },
                    ],
                }
            ];
        });
        datasetService.create(2, { examples: [], features: [] });
        datasetService.save(2);

        expect(fs.existsSync(path.join(experimentPath, `datasets${2}.gzip`)));
    });

    it('get should throw for not found', () => {
        expect(() => {
            datasetService.get(404);
        }).toThrow();
    });

    it('delete should throw for not found', () => {
        expect(() => {
            datasetService.delete(404);
        }).toThrow();
    });

    it('delete should remove created dataset', () => {
        (pluginConverter.convert as jasmine.Spy).and.callFake(() => {
            return [
                {
                    id: 0,
                    experimentId: 0,
                    name: 'New Dataset',
                    examples: 3,
                    features: [
                        { name: 'F1', type: 'number', examples: [1, 2, 3] },
                        { name: 'F2', type: 'number', examples: [1, 2, 3] },
                        { name: 'F3', type: 'number', examples: [1, 2, 3] },
                    ],
                }
            ];
        });
        const ids = datasetService.create(2, { examples: [], features: [] });
        datasetService.delete(ids[0]);
        expect(datasetService.all(2).length).toBe(0);
    });

    it('delete by experiment id should unlink file', () => {
        (pluginConverter.convert as jasmine.Spy).and.callFake(() => {
            return [
                {
                    id: 0,
                    experimentId: 0,
                    name: 'New Dataset',
                    examples: 3,
                    features: [
                        { name: 'F1', type: 'number', examples: [1, 2, 3] },
                        { name: 'F2', type: 'number', examples: [1, 2, 3] },
                        { name: 'F3', type: 'number', examples: [1, 2, 3] },
                    ],
                }
            ];
        });

        datasetService.create(2, { examples: [], features: [] });
        datasetService.save(2);

        datasetService.deleteByExperiment(2);
        expect(fs.existsSync(path.join(experimentPath, `datasets${2}.gzip`))).toBeFalsy();
    });

    it('view only shows preview of dataset', () => {
        datasetService.load(1);
        const view = datasetService.view(1);

        expect(view.experimentId).toBe(1);
        expect(view.name).toBe('Name1');
        expect(view.examples).toBe(3);
        expect(view.features.length).toBe(3);
        expect(view.previewExamples.length).toBe(1);
    });


    it('update should change name of dataset', () => {
        (pluginConverter.convert as jasmine.Spy).and.callFake(() => {
            return [
                {
                    id: 0,
                    experimentId: 0,
                    name: 'New Dataset',
                    examples: 3,
                    features: [
                        { name: 'F1', type: 'number', examples: [1, 2, 3] },
                        { name: 'F2', type: 'number', examples: [1, 2, 3] },
                        { name: 'F3', type: 'number', examples: [1, 2, 3] },
                    ],
                }
            ];
        });
        const id = datasetService.create(2, { examples: [], features: [] })[0];
        const dataset = datasetService.get(id);
        dataset.name = 'Update Dataset';
        datasetService.update(dataset);

        expect(datasetService.get(id).name).toBe('Update Dataset');

        datasetService.deleteByExperiment(2);
    });

    it('split should create a second dataset with the other half of data', () => {
        (pluginConverter.convert as jasmine.Spy).and.callFake(() => {
            return [
                {
                    id: 0,
                    experimentId: 0,
                    name: 'New Dataset',
                    examples: 4,
                    features: [
                        { name: 'F1', type: 'number', examples: [1, 2, 3, 4] },
                        { name: 'F2', type: 'number', examples: [1, 2, 3, 4] },
                        { name: 'F3', type: 'number', examples: [1, 2, 3, 4] },
                    ],
                }
            ];
        });
        const id = datasetService.create(2, { examples: [], features: [] })[0];
        const splitId = datasetService.split(id, 2);

        const dataset = datasetService.get(id);
        const splitDataset = datasetService.get(splitId);

        expect(dataset.examples).toBe(2);
        expect(dataset.features.length).toBe(3);
        expect(dataset.experimentId).toBe(2);
        expect(dataset.features[0].name).toBe('F1');
        expect(dataset.features[1].name).toBe('F2');
        expect(dataset.features[2].name).toBe('F3');
        expect(dataset.features[0].type).toBe('number');
        expect(dataset.features[1].type).toBe('number');
        expect(dataset.features[2].type).toBe('number');
        expect(dataset.features[0].examples.length).toBe(2);
        expect(dataset.features[0].examples[0]).toBe(1);
        expect(dataset.features[0].examples[1]).toBe(2);
        expect(dataset.features[1].examples.length).toBe(2);
        expect(dataset.features[1].examples[0]).toBe(1);
        expect(dataset.features[1].examples[1]).toBe(2);
        expect(dataset.features[2].examples.length).toBe(2);
        expect(dataset.features[2].examples[0]).toBe(1);
        expect(dataset.features[2].examples[1]).toBe(2);
        expect(splitDataset.examples).toBe(2);
        expect(splitDataset.features.length).toBe(3);
        expect(splitDataset.experimentId).toBe(2);
        expect(splitDataset.features[0].name).toBe('F1');
        expect(splitDataset.features[1].name).toBe('F2');
        expect(splitDataset.features[2].name).toBe('F3');
        expect(splitDataset.features[0].type).toBe('number');
        expect(splitDataset.features[1].type).toBe('number');
        expect(splitDataset.features[2].type).toBe('number');
        expect(splitDataset.features[0].examples.length).toBe(2);
        expect(splitDataset.features[0].examples[0]).toBe(3);
        expect(splitDataset.features[0].examples[1]).toBe(4);
        expect(splitDataset.features[1].examples.length).toBe(2);
        expect(splitDataset.features[1].examples[0]).toBe(3);
        expect(splitDataset.features[1].examples[1]).toBe(4);
        expect(splitDataset.features[2].examples.length).toBe(2);
        expect(splitDataset.features[2].examples[0]).toBe(3);
        expect(splitDataset.features[2].examples[1]).toBe(4);

        datasetService.deleteByExperiment(2);
    });

});

