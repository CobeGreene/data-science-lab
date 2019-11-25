import { PluginPackage, Plugin } from '../../../shared/models';
import { AlgorithmPlugin } from 'data-science-lab-core';

export class ExperimentAlgorithm {
    public id: number;
    public label: string;
    public experimentId: number;

    public dataGroupTrainId?: number;
    public dataGroupFeatures: { [id: string]: { label: string, type: string }[] };

    public pluginPackage: PluginPackage;
    public plugin: Plugin;
    public algorithmPlugin: AlgorithmPlugin;

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
    }

}
