import { Component, OnInit, OnDestroy } from '@angular/core';
import { PackageService  } from '../../services';
import { PluginPackageList, PluginPackage } from '../../../../shared/models';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

@Component({
    selector: 'app-packages-sidebar',
    templateUrl: './packages-sidebar.component.html',
    styleUrls: []
})
export class PackagesSidebarComponent implements OnInit, OnDestroy {
    
    installedCount: number;

    constructor(private packagesService: PackageService) {
        
    }

    ngOnInit(): void {
        this.installedCount = this.getInstalledCount(this.packagesService.all());
        this.packagesService.packagesChanged
            .pipe(untilComponentDestroyed(this))
            .subscribe((value: PluginPackageList) => {
               this.installedCount = this.getInstalledCount(value);
        });
    }

    ngOnDestroy(): void {
    }

    public getInstalledCount(value: PluginPackageList): number {
        return value.packages.filter((pluginPackage: PluginPackage) => {
            return pluginPackage.install;
          }).length;
    }
}
