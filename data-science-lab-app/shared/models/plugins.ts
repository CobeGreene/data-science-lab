import { Serializable, JsonProperty } from 'typescript-json-serializer';
import { Plugin } from './plugin';

@Serializable()
export class Plugins {
    @JsonProperty()
    public plugins: Plugin[];

    constructor(plugins: Plugin[] = []) {
        this.plugins = plugins;
    }
}
