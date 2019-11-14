import { Plugin } from './plugin';

export class PluginPackage {
    public name: string;
    public owner: string;
    public repositoryName: string;
    public username: string;
    public plugins: Plugin[];
    public install: boolean;

    constructor(pluginPackage:
        {
            name: string, owner: string, repositoryName: string,
            username: string, plugins?: Plugin[], install?: boolean
        }) {
        this.name = pluginPackage.name;
        this.owner = pluginPackage.owner;
        this.repositoryName = pluginPackage.repositoryName;
        this.username = pluginPackage.username;
        this.plugins = pluginPackage.plugins || [];
        this.install = pluginPackage.install || false;
    }
}
