import { Plugin } from '../../../shared/models';

export class ExperimentAlgorithmPlugins {
    id: number;
    algorithmPlugins: Plugin[];

    constructor(experimentAlgorthmPlugins: {
        id: number, algorithmPlugins: Plugin[]
    }) {
        this.id = experimentAlgorthmPlugins.id;
        this.algorithmPlugins = experimentAlgorthmPlugins.algorithmPlugins;
    }
}
