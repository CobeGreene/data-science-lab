import { AppAlgorithmDataService } from './app-algorithm.data-service';
import { AlgorithmObject } from '../../models';
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
import { doesNotThrow } from 'assert';

describe('Electron App Algorithm Data Service', () => {
    let algorithmService: AppAlgorithmDataService;
    let settings: SettingsContext;
    let serviceContainer: ServiceContainer;
    let userSettings: UserSettingDataService;
    let context: PluginContext;
    let dataService: PackageDataService;
    let producer: Producer;
    let recorder: AlgorithmRecorderService;

    const maxId = 100;
    const experimentPath = path.join(__dirname, 'app-algorithm-services-folder');

    beforeEach(() => {
        if (!fs.existsSync(experimentPath)) {
            fs.mkdirSync(experimentPath);
        }

        settings = jasmine.createSpyObj('SettingsContext', ['get', 'set']);
        (settings.get as jasmine.Spy).and.callFake((key) => {
            if (key === 'algorithms') {
                return maxId;
            } else {
                return experimentPath;
            }
        });

        serviceContainer = jasmine.createSpyObj('ServiceContainer', ['resolve']);
        (serviceContainer.resolve as jasmine.Spy).and.callFake((type: SERVICE_TYPES) => {
            if (type === SERVICE_TYPES.SettingsContext) {
                return settings;
            } else if (type === SERVICE_TYPES.UserSettingDataService) {
                return userSettings;
            } else if (type === SERVICE_TYPES.PluginContext) {
                return context;
            } else if (type === SERVICE_TYPES.PackageDataService) {
                return dataService;
            } else if (type === SERVICE_TYPES.Producer) {
                return producer;
            } else if (type === SERVICE_TYPES.RecorderService) {
                return recorder;
            }
            throw new Error(`Couldn't resolve type ${type}.`);
        });
        userSettings = jasmine.createSpyObj('UserSettingDataService', ['find']);
        (userSettings.find as jasmine.Spy).and.callFake(() => {
            return {
                value: 10
            };
        });
        context = jasmine.createSpyObj('PluginContext', ['deactivate']);
        dataService = jasmine.createSpyObj('PackageDataService', ['find']);
        producer = jasmine.createSpyObj('Producer', ['send']);
        recorder = jasmine.createSpyObj('Recorder', ['current']);

        algorithmService = new AppAlgorithmDataService(serviceContainer);
        algorithmService.configure();
    });

    it('all should return length of 0', () => {
        expect(algorithmService.all().length).toBe(0);
    });

    it('create should return id of new object', () => {
        const algorithmPlugin = jasmine.createSpyObj('Algorithm', ['finishTraining']);

        const id = algorithmService.create(2, {} as any, algorithmPlugin);

        expect(id).toBeGreaterThanOrEqual(maxId);
        expect(algorithmService.all().length).toBe(1);
    });

    it('create should set finish training of new object', () => {
        const algorithmPlugin: AlgorithmPlugin = jasmine.createSpyObj('Algorithm', ['finishTraining']);
        (algorithmPlugin.finishTraining as jasmine.Spy).and.returnValue(true);

        const id = algorithmService.create(2, {} as any, algorithmPlugin);

        const obj = algorithmService.get(id);

        expect(obj.isFinish).toBeTruthy();

    });

    it('get should throw for not found', () => {
        expect(() => {
            algorithmService.get(404);
        }).toThrow();
    });


    it('delete should throw for not found', async (done) => {
        try {
            await algorithmService.delete(404);
            done.fail();
        } catch (error) {
            expect().nothing();
            done();
        }
    });

    it('view should throw for not found', () => {
        expect(() => {
            algorithmService.view(404);
        }).toThrow();
    });

    it('view should convert to view', () => {
        const algorithmPlugin: AlgorithmPlugin = jasmine.createSpyObj('Algorithm', ['finishTraining']);
        (algorithmPlugin.finishTraining as jasmine.Spy).and.returnValue(true);

        const id = algorithmService.create(2, {} as any, algorithmPlugin);

        const obj = algorithmService.view(id);

        expect(obj.isFinish).toBeTruthy();
    });

    it('delete should remove algorithm from list', async () => {
        const algorithmPlugin: AlgorithmPlugin = jasmine.createSpyObj('Algorithm', ['finishTraining']);
        (algorithmPlugin.finishTraining as jasmine.Spy).and.returnValue(true);

        const id = algorithmService.create(2, {} as any, algorithmPlugin);

        const temp = await algorithmService.delete(id);

        expect(temp).toBe(id);
        expect(algorithmService.all().length).toBe(0);
    });

    it('delete by experiment should remove all algorithms from list', async () => {
        const algorithmPlugin: AlgorithmPlugin = jasmine.createSpyObj('Algorithm', ['finishTraining']);
        (algorithmPlugin.finishTraining as jasmine.Spy).and.returnValue(true);

        const first = algorithmService.create(2, {} as any, algorithmPlugin);
        const second = algorithmService.create(2, {} as any, algorithmPlugin);

        const temp = await algorithmService.deleteByExperiment(2);

        expect(temp.length).toBe(2);
        expect(temp[0]).toBe(first);
        expect(temp[1]).toBe(second);
        expect(algorithmService.all(2).length).toBe(0);
    });

    it('update should change name of algorithm', () => {
        const algorithmPlugin: AlgorithmPlugin = jasmine.createSpyObj('Algorithm', ['finishTraining']);
        (algorithmPlugin.finishTraining as jasmine.Spy).and.returnValue(true);
        const id = algorithmService.create(2, {} as any, algorithmPlugin);

        const obj = algorithmService.get(id);
        obj.name = 'Update';
        algorithmService.update(obj);

        expect(algorithmService.get(id).name).toBe('Update');
    });

    it('delete should call deactivate', async () => {
        const algorithmPlugin: AlgorithmPlugin = jasmine.createSpyObj('Algorithm', ['finishTraining']);
        (algorithmPlugin.finishTraining as jasmine.Spy).and.returnValue(true);

        const id = algorithmService.create(2, {} as any, algorithmPlugin);

        const temp = await algorithmService.delete(id);

        expect(context.deactivate).toHaveBeenCalledTimes(1);
    });

    it('update should throw for not found', () => {
        expect(() => {
            algorithmService.update({
                id: 404
            } as any);
        }).toThrow();
    });

    it('start should throw if algorithm finish', () => {
        const algorithmPlugin: AlgorithmPlugin = jasmine.createSpyObj('Algorithm', ['finishTraining']);
        (algorithmPlugin.finishTraining as jasmine.Spy).and.returnValue(true);

        const id = algorithmService.create(2, {} as any, algorithmPlugin);

        expect(() => {
            algorithmService.start(id);
        }).toThrow();
    });

    it('start should create interval where producer send is called', (done) => {
        const algorithmPlugin: AlgorithmPlugin = jasmine.createSpyObj('Algorithm', ['finishTraining', 'step', 'setRecorderService']);
        (algorithmPlugin.finishTraining as jasmine.Spy).and.returnValue(false);

        const algorithmId = algorithmService.create(2, {} as any, algorithmPlugin);
        const obj = algorithmService.get(algorithmId);

        let count = 0;

        (producer.send as jasmine.Spy).and.callFake((event, id) => {
            expect(event).toBe(AlgorithmEvents.Change);
            expect(id).toBe(algorithmId);
            count++;
            if (count === 3) {
                expect(recorder.current).toHaveBeenCalledTimes(3);
                expect(algorithmPlugin.step).toHaveBeenCalledTimes(3);
                expect(obj.iteration).toBe(3);
                clearInterval(obj.trainer);
                done();
            }
        });

        algorithmService.start(algorithmId);
    });

    it('start should throw when training in progress', (done) => {
        const algorithmPlugin: AlgorithmPlugin = jasmine.createSpyObj('Algorithm', ['finishTraining', 'step', 'setRecorderService']);
        (algorithmPlugin.finishTraining as jasmine.Spy).and.returnValues(false);

        const algorithmId = algorithmService.create(2, {} as any, algorithmPlugin);
        const obj = algorithmService.get(algorithmId);

        algorithmService.start(algorithmId);

        (producer.send as jasmine.Spy).and.callFake((event, id) => {
            expect(event).toBe(AlgorithmEvents.Change);
            expect(id).toBe(algorithmId);
            expect(() => {
                algorithmService.start(algorithmId);
            }).toThrow();
            clearInterval(obj.trainer);
            done();
        });
    });


    it('stop should throw for not found', () => {
        expect(() => {
            algorithmService.stop(404);
        }).toThrow();
    });

    it('start should throw for not found', () => {
        expect(() => {
            algorithmService.start(404);
        }).toThrow();
    });

    it('stop should throw if not training', () => {
        const algorithmPlugin: AlgorithmPlugin = jasmine.createSpyObj('Algorithm', ['finishTraining', 'step', 'setRecorderService']);
        (algorithmPlugin.finishTraining as jasmine.Spy).and.returnValues(false);

        const algorithmId = algorithmService.create(2, {} as any, algorithmPlugin);
        const obj = algorithmService.get(algorithmId);

        expect(() => {
            algorithmService.stop(algorithmId);
        }).toThrow();
    });

    it('stop should stop training and clear timer', () => {
        const algorithmPlugin: AlgorithmPlugin = jasmine.createSpyObj('Algorithm', ['finishTraining', 'step', 'setRecorderService']);
        (algorithmPlugin.finishTraining as jasmine.Spy).and.returnValues(false);

        const algorithmId = algorithmService.create(2, {} as any, algorithmPlugin);
        
        algorithmService.start(algorithmId);
        
        algorithmService.stop(algorithmId);
        
        
        const obj = algorithmService.get(algorithmId);

        expect(obj.isTraining).toBeFalsy();
        expect(obj.trainer).toBeUndefined();
    });

    it('step should clear timer when algorithm is finish', (done) => {
        let count = 0;

        const algorithmPlugin: AlgorithmPlugin = jasmine.createSpyObj('Algorithm', ['finishTraining', 'step', 'setRecorderService']);
        (algorithmPlugin.finishTraining as jasmine.Spy).and.callFake(() => {
            if (count >= 3) {
                return true;
            }
            return false;
        });

        const algorithmId = algorithmService.create(2, {} as any, algorithmPlugin);
        const obj = algorithmService.get(algorithmId);

        (producer.send as jasmine.Spy).and.callFake((event, id) => {
            expect(event).toBe(AlgorithmEvents.Change);
            expect(id).toBe(algorithmId);
            count++;
            if (count === 4) {
                expect(obj.isFinish).toBeTruthy();
                expect(obj.iteration).toBe(4);
                expect(obj.trainer).toBeUndefined();
                done();
            }
        });

        algorithmService.start(algorithmId);
    });





});


