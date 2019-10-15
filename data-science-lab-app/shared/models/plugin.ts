import { Serializable, JsonProperty } from 'typescript-json-serializer';

@Serializable()
export class Plugin {
    @JsonProperty()
    public name: string;
    @JsonProperty()
    public owner: string;
    @JsonProperty()
    public repositoryName: string;
    @JsonProperty()
    public install: boolean;

    constructor(name: string, owner: string, repositoryName: string, install: boolean = false) {
        this.name = name;
        this.owner = owner;
        this.repositoryName = repositoryName;
        this.install = install;
    }
}
