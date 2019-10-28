import { Serializable, JsonProperty } from 'typescript-json-serializer';


@Serializable()
export class Plugin {
    @JsonProperty()
    public name: string;
    @JsonProperty()
    public className: string;
    @JsonProperty()
    public description: string;
    @JsonProperty()
    public type: string;
    @JsonProperty()
    public packageName?: string;

    constructor(plugin: { name: string, className: string, description: string, type: string, packageName?: string }) {
        this.name = plugin.name;
        this.className = plugin.className;
        this.description = plugin.description;
        this.type = plugin.type;
        this.packageName = plugin.packageName;
    }
}
