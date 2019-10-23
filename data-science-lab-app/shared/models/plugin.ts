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

    constructor(name: string, className: string, description: string, type: string) {
        this.name = name;
        this.className = className;
        this.description = description;
        this.type = type;
    }
}
