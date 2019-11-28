import { PluginPackage, Plugin } from '../../../shared/models';
import { AlgorithmPlugin, RecorderService } from 'data-science-lab-core';
import { setInterval } from 'timers';

export class ExperimentAlgorithm {
    public id: number;
    public label: string;
    public experimentId: number;

    public dataGroupTrainId?: number;
    public dataGroupFeatures: { [id: string]: { label: string, type: string }[] };

    public pluginPackage: PluginPackage;
    public plugin: Plugin;
    public algorithmPlugin: AlgorithmPlugin;

    public hasInitialize: boolean;
    public hasStarted: boolean;
    public trainTimer: NodeJS.Timer;
    public iteration: number;

    constructor(alg: {
        id?: number, label: string, experimentId?: number,
        dataGroupTrainId?: number, dataGroupFeatures?: { [id: string]: { label: string, type: string }[] },
        pluginPackage: PluginPackage,
        plugin: Plugin,
        algorithmPlugin: AlgorithmPlugin
    }) {
        this.id = alg.id || 0;
        this.label = alg.label;
        this.experimentId = alg.experimentId || 0;
        this.dataGroupTrainId = alg.dataGroupTrainId;
        this.dataGroupFeatures = alg.dataGroupFeatures || {};
        this.pluginPackage = alg.pluginPackage;
        this.plugin = alg.plugin;
        this.algorithmPlugin = alg.algorithmPlugin;
        this.hasInitialize = false;
        this.hasStarted = false;
        this.trainTimer = undefined;
        this.iteration = 0;
    }

    start(recorder: RecorderService) {
        if (this.hasInitialize) {
            this.algorithmPlugin.initialize();
            this.hasInitialize = true;
        }
        this.hasStarted = true;
        this.algorithmPlugin.setRecorderService(recorder);
        this.trainTimer = setInterval(this.step, 1000);
    }

    step = () => {
        this.algorithmPlugin.step();
        ++this.iteration;
    }

    stop() {
        clearInterval(this.trainTimer);
        this.hasStarted = false;
    }

}
