import { PluginPackage, Plugin } from '../../../shared/models';
import { AlgorithmPlugin } from 'data-science-lab-core';

export class AlgorithmSession {

    public dataGroupId: number;
    public dataGroupFeatures: { [id: string]: { label: string, type: string}[] };
    public pluginPackage: PluginPackage;
    public plugin: Plugin;
    public algorithmPlugin: AlgorithmPlugin;

    constructor(session: {
        dataGroupId: number, pluginPackage: PluginPackage,
        dataGroupFeatures: { [id: string]: { label: string, type: string}[] },
        plugin: Plugin, algorithmPlugin: AlgorithmPlugin
    }) {
        this.dataGroupId = session.dataGroupId;
        this.pluginPackage = session.pluginPackage;
        this.dataGroupFeatures = session.dataGroupFeatures;
        this.plugin = session.plugin;
        this.algorithmPlugin = session.algorithmPlugin;
    }
}
