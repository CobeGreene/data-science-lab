import { PluginPackage, Plugin } from '../../../shared/models';


export class AlgorithmSession {

    public dataGroupId: number;
    public dataGroupIndices: { [id: string]: number[] };
    public pluginPackage: PluginPackage;
    public plugin: Plugin;
    public algorithmPlugin: any;

    constructor(session: {
        dataGroupId: number, pluginPackage: PluginPackage,
        dataGroupIndices: { [id: string]: number[] },
        plugin: Plugin, algorithmPlugin: any
    }) {
        this.dataGroupId = session.dataGroupId;
        this.pluginPackage = session.pluginPackage;
        this.dataGroupIndices = session.dataGroupIndices;
        this.plugin = session.plugin;
        this.algorithmPlugin = session.algorithmPlugin;
    }
}
