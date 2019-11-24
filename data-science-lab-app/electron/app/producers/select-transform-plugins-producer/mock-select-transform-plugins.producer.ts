import { SelectTransformPluginsProducer } from './select-transform-plugins.producer';
import { TransformPluginViewModel } from '../../../../shared/view-models';


export class MockSelectTransformPluginsProducer implements SelectTransformPluginsProducer {
    all: (plugins: TransformPluginViewModel[]) => void;
    
    error: (reason: any) => void;

    constructor() {
        this.reset();
    }

    reset() {
        this.all = () => {};
        this.error = () => {};
    }
}

