import { ServiceContainer, SERVICE_TYPES } from "../../service-container";
import { UserSettingDataService } from "../user-setting-data-service";
import { SettingsContext } from "../../contexts/settings-context";
import * as fs from 'fs';
import * as path from 'path';
import * as zlib from 'zlib';
import { TrackerDataService } from "./tracker.data-service";
import { AppTrackerDataService } from "./app-tracker.data-service";
import { VariableTracker } from "data-science-lab-core";



describe('Electron App Tracker Data Service', () => {
    let serviceContainer: ServiceContainer;
    let userService: UserSettingDataService;
    let settingService: SettingsContext;
    let trackerService: TrackerDataService;

    const experimentPath = path.join(__dirname, 'app-tracker-services-folder');

    beforeEach(() => {
        if (!fs.existsSync(experimentPath)) {
            fs.mkdirSync(experimentPath);
        }

        fs.writeFileSync(path.join(experimentPath, `tracker1.gzip`), zlib.gzipSync(
            JSON.stringify({
                algorithmId: 1,
                variables: [
                    { type: 'number', name: 'Feature 1' }
                ],
                iterations: [
                    { at: 1, values: {
                        'Feature 1': 1
                    }},
                    { at: 2, values: {
                        'Feature 1': 2
                    }},
                    { at: 3, values: {
                        'Feature 1': 3
                    }},
                    { at: 4, values: {
                        'Feature 1': 4
                    }},
                    { at: 5, values: {
                        'Feature 1': 5
                    }},
                ]
            })
        ));

        settingService = jasmine.createSpyObj('SettingsContext', ['get']);
        (settingService.get as jasmine.Spy).and.callFake((key) => {
            return experimentPath;
        });
        userService = jasmine.createSpyObj('UserSettingDataService', ['find']);
        (userService.find as jasmine.Spy).and.callFake(() => {
            return {
                value: 3
            };
        });
        serviceContainer = jasmine.createSpyObj('ServiceContainer', ['resolve']);
        (serviceContainer.resolve as jasmine.Spy).and.callFake((type: SERVICE_TYPES) => {
            if (type === SERVICE_TYPES.SettingsContext) {
                return settingService;
            } else if (type === SERVICE_TYPES.UserSettingDataService) {
                return userService;
            }
            throw new Error(`Couldn't resolve type ${type}.`);
        });

        trackerService = new AppTrackerDataService(serviceContainer);
    });

    it('all should return length of 0', () => {
        expect(trackerService.all().length).toBe(0);
    });

    it('all view should return length of 0', () => {
        expect(trackerService.allView().length).toBe(0);
    });

    it('get should throw not found', () => {
        expect(() => {
            trackerService.get(404);
        }).toThrow();
    });

    it('get should return tracker object', () => {
        trackerService.load(1);
        const tracker = trackerService.get(1);
        expect(tracker.iterations.length).toBe(5);
    });

    it('view should return the last three iteration', () => {
        trackerService.load(1);
        const view = trackerService.view(1);
        expect(view.recentIterations.length).toBe(3);
        expect(view.recentIterations[0].at).toBe(3);
        expect(view.recentIterations[1].at).toBe(4);
        expect(view.recentIterations[2].at).toBe(5);
    });

    it('update should throw for not found', () => {
        expect(() => {
            trackerService.update({
                algorithmId: 404,
                iterations: [],
                variables: []
            });
        }).toThrow();
    });

    it('update should change variables', () => {
        trackerService.load(1);
        trackerService.update({
            algorithmId: 1,
            iterations: [],
            variables: []
        });
        const tracker = trackerService.get(1);
        expect(tracker.iterations.length).toBe(0);
        expect(tracker.variables.length).toBe(0);
    });

    it('has should return false when not load', () => {
        expect(trackerService.has(1)).toBeFalsy();
    });

    it('has should return true when loaded', () => {
        trackerService.load(1);
        expect(trackerService.has(1)).toBeTruthy();
    });

    it('create should throw for already created', () => {
        trackerService.load(1);
        expect(() => {
            trackerService.create(1);
        }).toThrow();
    });

    it('create should push a new tracker', () => {
        trackerService.create(2);
        expect(trackerService.has(2)).toBeTruthy();
    });

    it('delete should throw for not found', () => {
        expect(() => {
            trackerService.delete(404);
        }).toThrow();
    });

    it('delete should not have tracker', () => {
        trackerService.load(1);
        trackerService.delete(1);
        expect(trackerService.has(1)).toBeFalsy();
    });

    it('delete and save should unlink file', () => {
        trackerService.load(1);
        trackerService.delete(1);
        trackerService.save(1);
        expect(fs.existsSync(path.join(experimentPath, 'tracker1.gzip'))).toBeFalsy();
    });

    it('create and save should link file', () => {
        trackerService.create(2);
        trackerService.save(2);
        expect(fs.existsSync(path.join(experimentPath, 'tracker2.gzip'))).toBeTruthy();
    });

    it('push should add new iteration', () => {
        trackerService.load(1);
        trackerService.push(1, 6, [
            {
                label: 'Feature 1',
                value: 6
            }
        ]);
        const tracker = trackerService.get(1);
        expect(tracker.iterations.length).toBe(6);
    });

    it('push should add description', () => {
        trackerService.load(1);
        trackerService.push(1, 6, [
            {
                label: 'Feature 1',
                description: 'desc',
                value: 6
            }
        ]);
        const tracker = trackerService.get(1);
        expect(tracker.variables[0].description).toBe('desc');
    });

    it('push should add new variable', () => {
        trackerService.load(1);
        trackerService.push(1, 6, [
            {
                label: 'Feature 2',
                value: 6
            }
        ]);
        const tracker = trackerService.get(1);
        expect(tracker.variables.length).toBe(2);
        expect(tracker.variables[1].type).toBe('number');
    });

    it('push should add new variable to current iteration', () => {
        trackerService.load(1);
        trackerService.push(1, 5, [
            {
                label: 'Feature 2',
                value: 5
            }
        ]);
        const tracker = trackerService.get(1);
        expect(tracker.iterations[4].values['Feature 2']).toBe(5);
    }); 

    it('extract should return two plugin data', () => {
        trackerService.load(1);
        const data = trackerService.extract(1, {
            x: [0],
            y: [1]
        }, [0, 1]);

        expect(data.x.features.length).toBe(1);
        expect(data.x.features[0]).toBe('Iteration');
        expect(data.x.examples.length).toBe(5);
        expect(data.x.examples[0][0]).toBe(1);
        expect(data.x.examples[4][0]).toBe(5);
        expect(data.y.features.length).toBe(1);
        expect(data.y.features[0]).toBe('Feature 1');
        expect(data.y.examples.length).toBe(5);
        expect(data.y.examples[0][0]).toBe(1);
        expect(data.y.examples[4][0]).toBe(5);
    });
});
