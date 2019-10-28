import { PackageConsumer } from './package.consumer';

export class MockPackageConsumer implements PackageConsumer {

    public initialize: () => void;
    public destory: () => void;

    constructor() {
        this.initialize = () => {};
        this.destory = () => {};
    }



}
