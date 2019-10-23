import { Component, OnInit, OnDestroy } from '@angular/core';
import { PackageService } from '../../services';
import { PluginPackageList, PluginPackage, } from '../../../../shared/models';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

@Component({
    selector: 'app-packages-installed',
    templateUrl: './packages-installed.component.html',
    styleUrls: []
})
export class PackagesInstalledComponent implements OnInit, OnDestroy {

    packagesList: PluginPackageList;

    constructor(private packageService: PackageService) {

    }

    ngOnInit(): void {
        this.packagesList = this.packageService.all();
        this.packageService.packagesChanged
            .pipe(untilComponentDestroyed(this))
            .subscribe((value: PluginPackageList) => {
                this.packagesList = this.getInstalledPackages(value);
            });
    }

    ngOnDestroy(): void {
    }

    public getInstalledPackages(value: PluginPackageList) {
        return new PluginPackageList(
            value.packages.filter((pluginPackage: PluginPackage) => {
                return pluginPackage.install;
            })
        ); 
    }
}
