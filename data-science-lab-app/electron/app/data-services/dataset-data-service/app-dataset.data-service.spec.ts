import { DatasetDataService } from './dataset.data-service';
import { SettingsContext } from '../../contexts/settings-context';
import { ServiceContainer, SERVICE_TYPES } from '../../service-container';
import { UserSettingDataService } from '../user-setting-data-service';
import { PluginDataConverter } from '../../converters/plugin-data-converter/plugin-data.converter';
import { AppDatasetDataService } from './app-dataset.data-service';
import * as fs from 'fs';
import * as path from 'path';
import * as zlib from 'zlib';
import { PluginData } from 'data-science-lab-core';

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
        datasetService.save(2);
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

    it('join should delete one datasets and increase the other', () => {
        (pluginConverter.convert as jasmine.Spy).and.callFake(() => {
            return [
                {
                    id: 0,
                    experimentId: 0,
                    name: 'New Dataset',
                    examples: 2,
                    features: [
                        { name: 'F1', type: 'number', examples: [1, 2] },
                        { name: 'F2', type: 'number', examples: [1, 2] },
                        { name: 'F3', type: 'number', examples: [1, 2] },
                    ],
                },
                {
                    id: 0,
                    experimentId: 0,
                    name: 'New Dataset',
                    examples: 2,
                    features: [
                        { name: 'F1', type: 'number', examples: [3, 4] },
                        { name: 'F2', type: 'number', examples: [3, 4] },
                        { name: 'F3', type: 'number', examples: [3, 4] },
                    ],
                }
            ];
        });
        const ids = datasetService.create(2, { examples: [], features: [] });
        const { updateId, deletedIds } = datasetService.join(ids);

        expect(updateId).toBe(ids[0]);
        expect(deletedIds.length).toBe(1);
        expect(deletedIds[0]).toBe(ids[1]);

        const dataset = datasetService.get(updateId);
        expect(dataset.examples).toBe(4);
        expect(dataset.features.length).toBe(3);
        expect(dataset.features[0].examples.length).toBe(4);
        expect(dataset.features[1].examples.length).toBe(4);
        expect(dataset.features[2].examples.length).toBe(4);

        expect(() => {
            datasetService.get(deletedIds[0]);
        }).toThrow();

    });

    it('join should throw for one ids', () => {
        (pluginConverter.convert as jasmine.Spy).and.callFake(() => {
            return [
                {
                    id: 0,
                    experimentId: 0,
                    name: 'New Dataset',
                    examples: 2,
                    features: [
                        { name: 'F1', type: 'number', examples: [1, 2] },
                        { name: 'F2', type: 'number', examples: [1, 2] },
                        { name: 'F3', type: 'number', examples: [1, 2] },
                    ],
                }
            ];
        });
        const ids = datasetService.create(2, { examples: [], features: [] });

        expect(() => {
            datasetService.join(ids);
        }).toThrow();
    });

    it('join should throw for zero ids', () => {
        expect(() => {
            datasetService.join([]);
        }).toThrow();
    });

    it('join should throw for different names', () => {
        (pluginConverter.convert as jasmine.Spy).and.callFake(() => {
            return [
                {
                    id: 0,
                    experimentId: 0,
                    name: 'New Dataset',
                    examples: 2,
                    features: [
                        { name: 'F1', type: 'number', examples: [1, 2] },
                        { name: 'F2', type: 'number', examples: [1, 2] },
                        { name: 'F3', type: 'number', examples: [1, 2] },
                    ],
                },
                {
                    id: 0,
                    experimentId: 0,
                    name: 'New Dataset',
                    examples: 2,
                    features: [
                        { name: 'F1', type: 'number', examples: [3, 4] },
                        { name: 'F2', type: 'number', examples: [3, 4] },
                        { name: 'F4', type: 'number', examples: [3, 4] },
                    ],
                }
            ];
        });
        const ids = datasetService.create(2, { examples: [], features: [] });

        expect(() => {
            datasetService.join(ids);
        }).toThrow();
    });

    it('join should throw for different type', () => {
        (pluginConverter.convert as jasmine.Spy).and.callFake(() => {
            return [
                {
                    id: 0,
                    experimentId: 0,
                    name: 'New Dataset',
                    examples: 2,
                    features: [
                        { name: 'F1', type: 'number', examples: [1, 2] },
                        { name: 'F2', type: 'number', examples: [1, 2] },
                        { name: 'F3', type: 'number', examples: [1, 2] },
                    ],
                },
                {
                    id: 0,
                    experimentId: 0,
                    name: 'New Dataset',
                    examples: 2,
                    features: [
                        { name: 'F1', type: 'number', examples: [3, 4] },
                        { name: 'F2', type: 'number', examples: [3, 4] },
                        { name: 'F3', type: 'string', examples: ['3', '4'] },
                    ],
                }
            ];
        });
        const ids = datasetService.create(2, { examples: [], features: [] });

        expect(() => {
            datasetService.join(ids);
        }).toThrow();

        datasetService.deleteByExperiment(2);
    });

    it('extract should return two plugin data', () => {
        (pluginConverter.convert as jasmine.Spy).and.callFake(() => {
            return [
                {
                    id: 0,
                    experimentId: 0,
                    name: 'New Dataset',
                    examples: 2,
                    features: [
                        { name: 'F1', type: 'number', examples: [1, 2] },
                        { name: 'F2', type: 'number', examples: [3, 4] },
                        { name: 'F3', type: 'number', examples: [5, 6] },
                    ],
                },
            ];
        });

        const id = datasetService.create(2, { examples: [], features: [] })[0];

        const data = datasetService.extract(id, {
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

        datasetService.deleteByExperiment(2);
    });

    it('transform should convert features to number', () => {
        (pluginConverter.convert as jasmine.Spy).and.returnValues([
            {
                id: 0,
                experimentId: 0,
                name: 'New Dataset',
                examples: 2,
                features: [
                    { name: 'F1', type: 'string', examples: ['1', '2'] },
                    { name: 'F2', type: 'string', examples: ['3', '4'] },
                    { name: 'F3', type: 'string', examples: ['5', '6'] },
                ],
            },
        ], [
            {
                id: 0,
                experimentId: 0,
                name: 'New Dataset',
                examples: 2,
                features: [
                    { name: 'F1', type: 'number', examples: [1, 2] },
                    { name: 'F2', type: 'number', examples: [3, 4] },
                    { name: 'F3', type: 'number', examples: [5, 6] },
                ],
            },
        ]);

        const id = datasetService.create(2, { examples: [], features: [] })[0];

        const { updateId, createIds } = datasetService.transform(id, [new PluginData({ features: [], examples: [] })], [0, 1, 2]);

        expect(updateId).toBe(id);
        expect(createIds.length).toBe(0);

        const dataset = datasetService.get(id);
        expect(dataset.examples).toBe(2);
        expect(dataset.features[0].type).toBe('number');
        expect(dataset.features[1].type).toBe('number');
        expect(dataset.features[2].type).toBe('number');

        datasetService.deleteByExperiment(2);
    });

    it('transform should add a feature row for multiple two', () => {
        (pluginConverter.convert as jasmine.Spy).and.returnValues([
            {
                id: 0,
                experimentId: 0,
                name: 'New Dataset',
                examples: 2,
                features: [
                    { name: 'F1', type: 'number', examples: [1, 2] },
                    { name: 'F2', type: 'number', examples: [3, 4] },
                ],
            },
        ], [
            {
                id: 0,
                experimentId: 0,
                name: 'New Dataset',
                examples: 2,
                features: [
                    { name: 'F1 * F2', type: 'number', examples: [3, 8] },
                ],
            },
        ]);

        const id = datasetService.create(2, { examples: [], features: [] })[0];

        const { updateId, createIds } = datasetService.transform(id, [new PluginData({ features: [], examples: [] })], [0, 1]);

        expect(updateId).toBe(id);
        expect(createIds.length).toBe(0);

        const dataset = datasetService.get(id);
        expect(dataset.examples).toBe(2);
        expect(dataset.features.length).toBe(3);
        expect(dataset.features[0].type).toBe('number');
        expect(dataset.features[1].type).toBe('number');
        expect(dataset.features[2].type).toBe('number');

        datasetService.deleteByExperiment(2);
    });

    it('transform should create a new dataset for half feature', () => {
        (pluginConverter.convert as jasmine.Spy).and.returnValues([
            {
                id: 0,
                experimentId: 0,
                name: 'New Dataset',
                examples: 2,
                features: [
                    { name: 'F1', type: 'number', examples: [1, 2] },
                    { name: 'F2', type: 'number', examples: [3, 4] },
                ],
            },
        ], [
            {
                id: 0,
                experimentId: 0,
                name: 'New Dataset',
                examples: 1,
                features: [
                    { name: 'F1', type: 'number', examples: [1] },
                ],
            },
        ]);

        const id = datasetService.create(2, { examples: [], features: [] })[0];

        const { updateId, createIds } = datasetService.transform(id, [new PluginData({ features: [], examples: [] })], [0]);

        expect(updateId).toBe(id);
        expect(createIds.length).toBe(1);

        const dataset = datasetService.get(id);
        expect(dataset.examples).toBe(2);
        expect(dataset.features.length).toBe(1);
        expect(dataset.features[0].name).toBe('F2');

        const newDataset = datasetService.get(createIds[0]);
        expect(newDataset.examples).toBe(1);
        expect(newDataset.features.length).toBe(1);
        expect(newDataset.features[0].name).toBe('F1');

        datasetService.deleteByExperiment(2);
    });
    
    it('transform should create a new dataset but keep feature for half feature', () => {
        (pluginConverter.convert as jasmine.Spy).and.returnValues([
            {
                id: 0,
                experimentId: 0,
                name: 'New Dataset',
                examples: 2,
                features: [
                    { name: 'F1', type: 'number', examples: [1, 2] },
                    { name: 'F2', type: 'number', examples: [3, 4] },
                ],
            },
        ], [
            {
                id: 0,
                experimentId: 0,
                name: 'New Dataset',
                examples: 1,
                features: [
                    { name: 'Half F1', type: 'number', examples: [1] },
                ],
            },
        ]);

        const id = datasetService.create(2, { examples: [], features: [] })[0];

        const { updateId, createIds } = datasetService.transform(id, [new PluginData({ features: [], examples: [] })], [0]);

        expect(updateId).toBe(id);
        expect(createIds.length).toBe(1);

        const dataset = datasetService.get(id);
        expect(dataset.examples).toBe(2);
        expect(dataset.features.length).toBe(2);
        expect(dataset.features[0].name).toBe('F1');
        expect(dataset.features[1].name).toBe('F2');

        const newDataset = datasetService.get(createIds[0]);
        expect(newDataset.examples).toBe(1);
        expect(newDataset.features.length).toBe(1);
        expect(newDataset.features[0].name).toBe('Half F1');

        datasetService.deleteByExperiment(2);
    });





});

