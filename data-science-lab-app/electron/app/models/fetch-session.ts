import { FetchPlugin } from 'data-science-lab-core';
import { Plugin, PluginPackage } from '../../../shared/models';

export class FetchSession {
    public experimentId: number;
    public pluginPackage: PluginPackage;
    public plugin: Plugin;
    public fetchPlugin: FetchPlugin;

    constructor(session: {
        experimentId: number, pluginPackage: PluginPackage,
        plugin: Plugin, fetchPlugin: FetchPlugin
    }) {
        this.experimentId = session.experimentId;
        this.pluginPackage = session.pluginPackage;
        this.plugin = session.plugin;
        this.fetchPlugin = session.fetchPlugin;
    }

}
