import { SelectTransformPluginsProducer } from './select-transform-plugins.producer';
import { SelectTransformPlugin } from '../../../../shared/models';


export class MockSelectTransformPluginsProducer implements SelectTransformPluginsProducer {
    all: (plugins: SelectTransformPlugin[]) => void;
    
    error: (reason: any) => void;

    constructor() {
        this.reset();
    }

    reset() {
        this.all = () => {};
        this.error = () => {};
    }
}

