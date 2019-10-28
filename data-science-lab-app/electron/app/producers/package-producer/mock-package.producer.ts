import { PackageProducer } from './package.producer';
import { PluginPackageList } from '../../../../shared/models';

export class MockPackageProducer implements PackageProducer {

    public all: (list: PluginPackageList) => void;

    constructor() {
        this.reset();
    }
    
    public reset() {
        this.all = (_) => {};
    }
}
