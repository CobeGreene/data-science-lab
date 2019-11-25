import { AlgorithmSession } from '../../models';
import { Plugin, PluginPackage } from '../../../../shared/models';
import { PluginData } from 'data-science-lab-core';
import { AlgorithmSessionService } from './algorithm.session-service';


export class MockAlgorithmSessionService implements AlgorithmSessionService {
    all: () => AlgorithmSession[];

    read: (dataGroupId: number) => AlgorithmSession;

    delete: (dataGroupId: number) => void;

    create: (dataGroupId: number, pluginPackage: PluginPackage,
             plugin: Plugin,
             inputs: { [id: string]: PluginData; },
             features: { [id: string]: { label: string; type: string; }[]; }) => Promise<AlgorithmSession>;

    removeFromService: (dataGroupId: number) => void;

    constructor() {
        this.reset();
    }

    reset() {
        this.all = () => [];
        this.read = () => { throw new Error(`Not implemented`); };
        this.delete = () => { };
        this.create = () => { throw new Error('Not implemented'); };
        this.removeFromService = () => { };
    }

}


