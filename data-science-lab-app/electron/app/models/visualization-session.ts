import { VisualizationPlugin } from 'data-science-lab-core';
import { PluginPackage, Plugin } from '../../../shared/models';

export class VisualizationSession {
    public id: number;
    public editing: number[];
    public pluginPackage: PluginPackage;
    public plugin: Plugin;
    public visualizationPlugin: VisualizationPlugin;

    constructor(session: {
        id: number, pluginPackage: PluginPackage,
        editing: number[],
        plugin: Plugin,
        visualizationPlugin: VisualizationPlugin
    }) {
        this.id = session.id;
        this.plugin = session.plugin;
        this.pluginPackage = session.pluginPackage;
        this.editing = session.editing;
        this.visualizationPlugin = session.visualizationPlugin;
    }
}
