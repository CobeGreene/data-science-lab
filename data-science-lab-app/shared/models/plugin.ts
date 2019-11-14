export class Plugin {
    public name: string;
    public className: string;
    public description: string;
    public type: string;
    public packageName?: string;

    constructor(plugin: { name: string, className: string, description: string, type: string, packageName?: string }) {
        this.name = plugin.name;
        this.className = plugin.className;
        this.description = plugin.description;
        this.type = plugin.type;
        this.packageName = plugin.packageName;
    }
}
