import { Component, OnInit, OnDestroy } from '@angular/core';
import { PluginPackageList } from '../../../../shared/models';
import { PackageService } from '../../services';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { ActivatedRoute, Params } from '@angular/router';
import { PluginTypes } from 'data-science-lab-core';

@Component({
    selector: 'app-packages-list',
    templateUrl: './packages-list.component.html'
})
export class PackagesListComponent implements OnInit, OnDestroy {
    
    packagesList: PluginPackageList;
    installOnly: boolean;
    type = '';

    constructor(private packageService: PackageService,
                private route: ActivatedRoute) {

    }
    
    ngOnInit(): void {
        this.packagesList = this.packageService.all();

        this.route.params
            .pipe(untilComponentDestroyed(this))
            .subscribe((params: Params) => {
                this.installOnly = params.install === 'install';
            });

        this.packageService.packagesChanged
            .pipe(untilComponentDestroyed(this))
            .subscribe((value: PluginPackageList) => {
                this.packagesList = value;
            });
    }    
    
    ngOnDestroy(): void {
    }

    pluginTypes(): string[] {
        return Object.keys(PluginTypes);
    }


}

