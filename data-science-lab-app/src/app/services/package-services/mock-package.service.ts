import { PackageService } from './package.service';
import { PluginPackage, PluginPackageList } from '../../../../shared/models';
import { Subject } from 'rxjs';

export class MockPackageService implements PackageService {

    public packagesChanged: Subject<PluginPackageList>;

    private packageList: PluginPackageList;

    constructor() {
        this.packagesChanged = new Subject<PluginPackageList>();
        this.packageList = new PluginPackageList();
    }

    static init(packageList: PluginPackageList): MockPackageService {
        const service = new MockPackageService();
        service.packageList = packageList;
        return service;
    }

    all(): PluginPackageList {
        return this.packageList;
    }

    install(name: string): void {
        const found = this.packageList.packages.find((value: PluginPackage) => {
            return value.name === name;
        });
        if (!found) {
            throw new Error('Couldn\'t find package');
        } else if (found.install) {
            throw new Error('Package already installed');
        } else {
            found.install = true;
            this.packagesChanged.next(this.all());
        }
    }

    uninstall(name: string): void {
        const found = this.packageList.packages.find((value: PluginPackage) => {
            return value.name === name;
        });
        if (!found) {
            throw new Error('Couldn\t find package');
        } else if (!found.install) {
            throw new Error('Package is not installed');
        } else {
            found.install = false;
            this.packagesChanged.next(this.all());
        }
    }

    get(name: string): PluginPackage {
        const find = this.packageList.packages.find((value: PluginPackage) => {
            return value.name === name;
        });
        if (find == null) {
            throw new Error('Couldn\'t find package');
        }  
        return find;
    }
}
