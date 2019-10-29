import { PackageProducer } from './package.producer';
import { PluginPackageList } from '../../../../shared/models';
import { IpcService } from '../../../../shared/services';

export class MockPackageProducer implements PackageProducer {

    public all: (list: PluginPackageList) => void;
    public error: (reason: any) => void;

    constructor() {
        this.reset();
    }
    
    public reset() {
        this.all = (_) => {};
        this.error = (_) => {};
    }

}
