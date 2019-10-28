import { PackageService } from './package.service';

export class MockPackageService implements PackageService {

    constructor() {
        this.all = () => {};
        this.install = (_) => {};
        this.uninstall = (_) => {};
    }

    all: () => void;
    install: (name: string) => void;
    uninstall: (name: string) => void;
}
