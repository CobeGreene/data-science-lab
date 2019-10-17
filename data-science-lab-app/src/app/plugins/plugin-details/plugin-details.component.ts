import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { PluginService } from '../../services/plugin-services/plugin.service';
import { Plugin } from '../../../../shared/models/plugin';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

@Component({
    selector: 'app-plugin-details',
    templateUrl: './plugin-details.component.html',
    styleUrls: []
})
export class PluginDetailsComponent implements OnInit, OnDestroy {
    plugin: Plugin;

    constructor(private pluginService: PluginService,
                private route: ActivatedRoute,
                private router: Router,
                private zone: NgZone) {
    }

    ngOnInit(): void {
        this.route.params
            .pipe(untilComponentDestroyed(this))
            .subscribe((params: Params) => {
                const name = params.name;
                this.plugin = this.pluginService.get(name);
           });
    }

    onInstall(): void {
        this.pluginService.install(this.plugin.name);
        this.zone.run(() => {
           this.router.navigate(['/plugins', 'installed']); 
        });
    }

    onUninstall(): void {
        this.pluginService.uninstall(this.plugin.name);
        this.zone.run(() => {
            this.router.navigate(['/plugins', 'available']); 
         });
    }

    ngOnDestroy(): void {

    }

}
