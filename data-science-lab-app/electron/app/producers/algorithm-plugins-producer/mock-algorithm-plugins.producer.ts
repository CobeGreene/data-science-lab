import { AlgorithmPluginsProducer } from './algorithm-plugins.producer';
import { AlgorithmPluginViewModel } from '../../../../shared/view-models';


export class MockAlgorithmPluginsProducer implements AlgorithmPluginsProducer {
    all: (plugins: AlgorithmPluginViewModel[]) => void;
    
    error: (reason: any) => void;

    constructor() {
        this.reset();
    }

    reset() {
        this.all = () => {};
        this.error = () => {};
    }

}
