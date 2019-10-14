export class Plugin {
    public name: string;
    public owner: string;
    public repositoryName: string;
    public install: boolean;

    constructor(name: string, owner: string, repositoryName: string, install: boolean = false) {
        this.name = name;
        this.owner = owner;
        this.repositoryName = repositoryName;
        this.install = install;
    }
}
