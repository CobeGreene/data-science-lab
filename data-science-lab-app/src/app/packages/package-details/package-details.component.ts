import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { PackageService } from '../../services';
import { PluginPackage } from '../../../../shared/models';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

@Component({
    selector: 'app-package-details',
    templateUrl: './package-details.component.html',
    styleUrls: []
})
export class PackageDetailsComponent implements OnInit, OnDestroy {
    pluginPackage: PluginPackage;

    constructor(private packageService: PackageService,
                private route: ActivatedRoute,
                private router: Router,
                private zone: NgZone) {
    }

    ngOnInit(): void {
        this.route.params
        .pipe(untilComponentDestroyed(this))
        .subscribe((params: Params) => {
            const name = params.name;
            this.pluginPackage = this.packageService.get(name);
        });
        const current = this.route.snapshot.paramMap.get('name');
        this.pluginPackage = this.packageService.get(current);
    }

    onInstall(): void {
        this.packageService.install(this.pluginPackage.name);
        this.zone.run(() => {
            this.router.navigate(['/packages', 'installed']);
        });
    }

    onUninstall(): void {
        this.packageService.uninstall(this.pluginPackage.name);
        this.zone.run(() => {
            this.router.navigate(['/packages', 'available']);
        });
    }

    ngOnDestroy(): void {

    }

}
