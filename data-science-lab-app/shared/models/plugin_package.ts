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

    constructor(name: string, owner: string, repositoryName: string,
                username: string, plugins: Plugin[] = [], install: boolean = false) {
        this.name = name;
        this.owner = owner;
        this.repositoryName = repositoryName;
        this.username = username;
        this.plugins = plugins;
        this.install = install;
    }
}
