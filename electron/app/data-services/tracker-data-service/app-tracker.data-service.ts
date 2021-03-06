import { TrackerObject } from '../../models';
import { AlgorithmTracker, TrackerVariable, Iteration } from '../../../../shared/models';
import { VariableTracker, PluginData } from 'data-science-lab-core';
import { Service, SERVICE_TYPES, ServiceContainer } from '../../service-container';
import { TrackerDataService } from './tracker.data-service';
import { SettingsContext } from '../../contexts/settings-context';
import { UserSettingDataService } from '../user-setting-data-service';
import { Settings } from '../../../../shared/settings';
import { SystemError, ErrorTypes } from '../../../../shared/errors';
import * as fs from 'fs';
import * as path from 'path';
import * as zlib from 'zlib';
import { getType } from '../../helpers';

export class AppTrackerDataService extends Service implements TrackerDataService {
    private readonly key = 'trackers-path';

    private trackers: TrackerObject[];

    get context(): SettingsContext {
        return this.serviceContainer.resolve<SettingsContext>(SERVICE_TYPES.SettingsContext);
    }

    get user(): UserSettingDataService {
        return this.serviceContainer.resolve<UserSettingDataService>(SERVICE_TYPES.UserSettingDataService);
    }

    constructor(serviceContainer: ServiceContainer) {
        super(serviceContainer);

        this.trackers = [];
    }

    all(): TrackerObject[] {
        return this.trackers;
    }

    allView(): AlgorithmTracker[] {
        return this.trackers.map(value => this.toView(value));
    }

    get(algorithmId: number): TrackerObject {
        const find = this.trackers.find(value => value.algorithmId === algorithmId);
        if (find === undefined) {
            throw this.notFound(algorithmId);
        }
        return find;
    }

    notFound(algorithmId: number): SystemError {
        return {
            header: 'Tracker Error',
            description: `Couldn't find tracker with algorithm id ${algorithmId}`,
            type: ErrorTypes.Error
        };
    }

    alreadyCreated(algorithmId: number): SystemError {
        return {
            header: 'Tracker Error',
            description: `Algorithm with id ${algorithmId} already has tracker`,
            type: ErrorTypes.Error
        };
    }

    toView(tracker: TrackerObject): AlgorithmTracker {
        const setting = this.user.find(Settings.TrackerRecentIteration);
        const defaultRecent = (setting === undefined) ? 5 : setting.value;

        const start = (tracker.iterations.length - defaultRecent < 0) ? 0 :
            tracker.iterations.length - defaultRecent;

        return {
            algorithmId: tracker.algorithmId,
            variables: tracker.variables,
            recentIterations: tracker.iterations.slice(start)
        };
    }

    update(tracker: TrackerObject): void {
        const find = this.trackers.findIndex(value => value.algorithmId === tracker.algorithmId);
        if (find < 0) {
            throw this.notFound(tracker.algorithmId);
        }
        this.trackers.splice(find, 1, tracker);
    }


    has(algorithmId: number): boolean {
        return this.trackers.findIndex(value => value.algorithmId === algorithmId) >= 0;
    }

    view(algorithmId: number): AlgorithmTracker {
        const obj = this.get(algorithmId);
        return this.toView(obj);
    }

    load(algorithmId: number): void {
        const trackerPath = this.context.get<string>(this.key);
        const algorithmPath = path.join(trackerPath, `tracker${algorithmId}.gzip`);
        if (fs.existsSync(algorithmPath)) {
            const buffer = fs.readFileSync(algorithmPath);
            const tracker = JSON.parse(`${zlib.unzipSync(buffer)}`);
            this.trackers.push(tracker);
        }
    }

    save(algorithmId: number): void {
        const trackerPath = this.context.get<string>(this.key);
        const algorithmPath = path.join(trackerPath, `tracker${algorithmId}.gzip`);

        if (this.has(algorithmId)) {
            const tracker = this.get(algorithmId);
            const buffer = zlib.gzipSync(JSON.stringify(tracker));
            fs.writeFileSync(algorithmPath, buffer);
        } else if (fs.existsSync(algorithmPath)) {
            fs.unlinkSync(algorithmPath);
        }
    }

    create(algorithmId: number): void {
        if (this.has(algorithmId)) {
            throw this.alreadyCreated(algorithmId);
        }

        const tracker: TrackerObject = {
            algorithmId,
            iterations: [],
            variables: []
        };

        this.trackers.push(tracker);
    }

    delete(algorithmId: number) {
        const find = this.trackers.findIndex(value => value.algorithmId === algorithmId);
        if (find >= 0) {
            this.trackers.splice(find, 1);            
        } else {
            throw this.notFound(algorithmId);
        }
    }

    push(algorithmId: number, current: number, variables: VariableTracker[]): void {
        const obj = this.get(algorithmId);

        let iteration: Iteration = obj.iterations.find(value => value.at === current);
        const exists = iteration !== undefined;
        if (!exists) {
            iteration = {
                at: current,
                values: {}
            };
        }

        variables.forEach(variable => {
            iteration.values[variable.label] = variable.value;
            const find = obj.variables.findIndex((value) => value.name === variable.label);
            if (find >= 0) {
                obj.variables.splice(find, 1,
                    {
                        name: variable.label,
                        description: variable.description,
                        type: getType(variable.value)
                    });
            } else {
                obj.variables.push({
                    name: variable.label,
                    description: variable.description,
                    type: getType(variable.value)
                });
            }
        });

        if (!exists) {
            obj.iterations.push(iteration);
        }

        this.update(obj);
    }


    extract(id: number, inputs: { [id: string]: number[] }, selectedFeatures: number[]): { [id: string]: PluginData } {
        const data: { [id: string]: PluginData } = {};

        const tracker = this.get(id);

        for (const key in inputs) {
            if (inputs[key] === undefined) {
                return undefined;
            }

            const features: string[] = [];
            const examples: any[][] = [];

            for (let i = 0; i < tracker.iterations.length; ++i) {
                examples.push([]);
                for (const _ of inputs[key]) {
                    examples[i].push(undefined);
                }
            }

            for (let j = 0; j < inputs[key].length; ++j) {
                if (selectedFeatures[inputs[key][j]] === 0) {
                    features.push('Iteration');
                    for (let i = 0; i < tracker.iterations.length; ++i) {
                        examples[i][j] = tracker.iterations[i].at;
                    }
                } else {
                    features.push(tracker.variables[selectedFeatures[inputs[key][j]] - 1].name);
                    for (let i = 0; i < tracker.iterations.length; ++i) {
                        examples[i][j] = tracker.iterations[i].values[tracker.variables[selectedFeatures[inputs[key][j]] - 1].name];
                    }
                }

            }

            data[key] = {
                features,
                examples
            };
            
        }

        return data;
    }
    

}

