import { TransformPlugin } from 'data-science-lab-core';
import { Plugin, PluginPackage } from '../../../shared/models';


export class TransformSession {

    public dataGroupId: number;
    public featuresEditing: number[];
    public pluginPackage: PluginPackage;
    public plugin: Plugin;
    public transformPlugin: TransformPlugin;

    constructor(session: {
        dataGroupId: number, pluginPackage: PluginPackage,
        featuresEditing: number[],
        plugin: Plugin, transformPlugin: TransformPlugin
    }) {
        this.dataGroupId = session.dataGroupId;
        this.pluginPackage = session.pluginPackage;
        this.featuresEditing = session.featuresEditing;
        this.plugin = session.plugin;
        this.transformPlugin = session.transformPlugin;
    }

}
