import { PluginPackage } from './plugin_package';
import { Serializable, JsonProperty } from 'typescript-json-serializer';

@Serializable()
export class PluginPackageList {
    @JsonProperty()
    public packages: PluginPackage[];

    constructor(packages: PluginPackage[] = []) {
        this.packages = packages;
    }
}
