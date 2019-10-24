import { JsonProperty, Serializable } from 'typescript-json-serializer';
import { Plugin } from './plugin';

@Serializable()
export class PluginPackage {
    @JsonProperty()
    public name: string;
    @JsonProperty()
    public owner: string;
    @JsonProperty()
    public repositoryName: string;
    @JsonProperty()
    public username: string;
    @JsonProperty()
    public plugins: Plugin[];
    @JsonProperty()
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
