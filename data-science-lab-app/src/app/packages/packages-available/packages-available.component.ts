import { Component, OnInit, OnDestroy } from '@angular/core';
import { PackageService } from '../../services';
import { PluginPackageList, } from '../../../../shared/models';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

@Component({
    selector: 'app-packages-available',
    templateUrl: './packages-available.component.html',
    styleUrls: []
})
export class PackagesAvailableComponent implements OnInit, OnDestroy {

    packagesList: PluginPackageList;

    constructor(private packageService: PackageService) {

    }

    ngOnInit(): void {
        this.packagesList = this.packageService.all();
        this.packageService.packagesChanged
            .pipe(untilComponentDestroyed(this))
            .subscribe((value: PluginPackageList) => {
                this.packagesList = value;
            });
    }

    ngOnDestroy(): void {
    }
}
