import { Plugin } from './plugin';

export interface Package {
    name: string;
    owner: string;
    repositoryName: string;
    username: string;
    plugins: Plugin[];
    install: boolean;
}
