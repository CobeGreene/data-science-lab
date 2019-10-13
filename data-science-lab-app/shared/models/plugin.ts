export class Plugin {
    public name: string;
    public owner: string;
    public repositoryName: string;

    constructor(name: string, owner: string, repositoryName: string) {
        this.name = name;
        this.owner = owner;
        this.repositoryName = repositoryName;
    }
}
