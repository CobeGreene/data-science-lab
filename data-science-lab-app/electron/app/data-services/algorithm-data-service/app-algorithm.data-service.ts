import { ExperimentAlgorithmDataService } from './algorithm.data-service';
import { ExperimentAlgorithm } from '../../models';
import { SERVICE_TYPES, ServiceContainer } from '../../services-container';
import { PluginContext } from '../../contexts';
import { Plugin, PluginPackage } from '../../../../shared/models';
import { AlgorithmUpdateProducer } from '../../producers';
import { AlgorithmPlugin } from 'data-science-lab-core';

export class AppAlgorithmDataService implements ExperimentAlgorithmDataService {

    private algorithms: ExperimentAlgorithm[];
    private nextId: number;

    constructor(private serviceContainer: ServiceContainer) {
        this.algorithms = [];
        this.nextId = 1;
    }

    all(experimentId?: number): ExperimentAlgorithm[] {
        if (experimentId) {
            return this.algorithms.filter((value) => {
                return value.experimentId === experimentId;
            });
        } else {
            return this.algorithms;
        }
    }

    create(algorithm: ExperimentAlgorithm): ExperimentAlgorithm {
        algorithm.id = this.nextId++;
        this.algorithms.push(algorithm);
        return algorithm;
    }

    read(id: number): ExperimentAlgorithm {
        const find = this.algorithms.find((value) => {
            return value.id === id;
        });
        if (find) {
            return find;
        }
        throw new Error(`Couldn't find experiment algorithm with id ${id}`);
    }

    update(algorithm: ExperimentAlgorithm): void {
        const findIndex = this.algorithms.findIndex((value) => {
            return value.id === algorithm.id;
        });
        if (findIndex >= 0) {
            this.algorithms[findIndex] = algorithm;
        } else {
            throw new Error(`Couldn't find experiment algorithm with id ${algorithm.id}.`);
        }
    }

    // load(algorithms: ExperimentAlgorithm[], jsons: string[]) {
    //     algorithms.forEach(async (value, index) => {
    //         const algorithm = Object.setPrototypeOf(value, ExperimentAlgorithm.prototype) as ExperimentAlgorithm;
    //         algorithm.plugin = Object.setPrototypeOf(algorithm.plugin, Plugin.prototype) as Plugin;
    //         algorithm.pluginPackage = Object.setPrototypeOf(algorithm.pluginPackage, PluginPackage.prototype) as PluginPackage;
    //         algorithm.pluginPackage.plugins = algorithm.pluginPackage.plugins
    //             .map(plugin => Object.setPrototypeOf(plugin, Plugin.prototype) as Plugin);

    //         algorithm.updateProducer = this.serviceContainer.resolve<AlgorithmUpdateProducer>(SERVICE_TYPES.AlgorithmUpdateProducer);

    //         const pluginContext = this.serviceContainer.resolve<PluginContext>(SERVICE_TYPES.PluginContext); 
    //         const algorithmPlugin = await pluginContext.activate<AlgorithmPlugin>(algorithm.pluginPackage, algorithm.plugin);

    //         algorithm.algorithmPlugin = algorithmPlugin.import(jsons[index]);

    //         this.algorithms.push(algorithm);
    //     });
    // }

    export(algorithms: ExperimentAlgorithm[]): string[] {
        const jsons: string[] = [];

        algorithms.forEach((value) => {
            const json = {
                id: value.id,
                label: value.label,
                experimentId: value.experimentId,
                dataGroupTrainId: value.dataGroupTrainId,
                dataGroupFeatures: value.dataGroupFeatures,
                pluginPackage: value.pluginPackage,
                plugin: value.plugin,
                algorithmPlugin: value.algorithmPlugin.export(),
                hasInitialize: value.hasInitialize,
                hasStarted: false,
                iteration: value.iteration
            };
            jsons.push(JSON.stringify(json));
        });

        return jsons; 
    }

    load(jsons: string[]) {
        jsons.forEach(async (value) => {
            const json = JSON.parse(value);
            const plugin = Object.setPrototypeOf(json.plugin, Plugin.prototype) as Plugin;
            const pluginPackage = Object.setPrototypeOf(json.pluginPackage, PluginPackage.prototype) as PluginPackage;
            pluginPackage.plugins = pluginPackage.plugins.map(v => Object.setPrototypeOf(v, Plugin.prototype) as Plugin);

            const context = this.serviceContainer.resolve<PluginContext>(SERVICE_TYPES.PluginContext);
            let algorithmPlugin = await context.activate<AlgorithmPlugin>(pluginPackage, plugin);
            algorithmPlugin =  algorithmPlugin.import(json.algorithmPlugin);

            const experimentAlgorithm = new ExperimentAlgorithm({
                id: json.id,
                label: json.label,
                plugin,
                pluginPackage,
                algorithmPlugin,
                experimentId: json.experimentId,
                dataGroupFeatures: json.dataGroupFeatures,
                dataGroupTrainId: json.dataGroupTrainId
            });
            experimentAlgorithm.updateProducer = this.serviceContainer
                .resolve<AlgorithmUpdateProducer>(SERVICE_TYPES.AlgorithmUpdateProducer);
            experimentAlgorithm.hasInitialize = json.hasInitialize;
            experimentAlgorithm.iteration = json.iteration;

            this.algorithms.push(experimentAlgorithm);
        });
    }

    delete(id: number): void {
        const findIndex = this.algorithms.findIndex((value) => {
            return value.id === id;
        });
        if (findIndex >= 0) {
            const context = this.serviceContainer.resolve<PluginContext>(SERVICE_TYPES.PluginContext);
            context.deactivate(this.algorithms[findIndex].pluginPackage,
                this.algorithms[findIndex].plugin)
                .then(() => { })
                .catch(() => { });

            this.algorithms.splice(findIndex, 1);
        } else {
            throw new Error(`Couldn't find experiment algorithm with id ${id}`);
        }
    }
    deleteByExperiment(experimentId: number): void {
        this.algorithms.filter((value) => {
            return value.experimentId === experimentId;
        }).map((value) => {
            return value.id;
        }).forEach((value) => {
            this.delete(value);
        });
    }



}

