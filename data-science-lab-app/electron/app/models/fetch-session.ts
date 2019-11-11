import { FetchPlugin } from 'data-science-lab-core';
import { Plugin, PluginPackage } from '../../../shared/models';

export class FetchSession {
    public experimentId: number;
    public pluginPackage?: PluginPackage;
    public plugin?: Plugin;
    public fetchPlugin?: FetchPlugin;

    constructor(session: {
        experimentId: number
    }) {
        this.experimentId = session.experimentId;
        this.deselect();
    }

    get selected(): boolean {
        return this.pluginPackage !== null;
    }

    select(pluginPackage: PluginPackage, plugin: Plugin, fetchPlugin: FetchPlugin): void {
        this.pluginPackage = pluginPackage;
        this.plugin = plugin;
        this.fetchPlugin = fetchPlugin;
    }

    deselect() {
        this.pluginPackage = null;
        this.plugin = null;
        this.fetchPlugin = null;
    }
}
