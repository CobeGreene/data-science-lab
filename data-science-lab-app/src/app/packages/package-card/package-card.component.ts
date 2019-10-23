import { Component, Input, NgZone } from '@angular/core';
import { PluginPackage } from '../../../../shared/models';
import { Router } from '@angular/router';

@Component({
    selector: 'app-package-card',
    templateUrl: './package-card.component.html',
    styleUrls: []
})
export class PackageCardComponent {
    @Input()
    pluginPackage: PluginPackage;

    constructor(private router: Router, private zone: NgZone) {

    }

    onSeeDetails(): void {
        this.zone.run(() => {
            this.router.navigate(['/packages', 'details', this.pluginPackage.name]);
        });
    }

}
