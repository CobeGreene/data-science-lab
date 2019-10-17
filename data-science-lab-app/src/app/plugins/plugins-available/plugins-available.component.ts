import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { PluginService } from '../../services/plugin-services/plugin.service';
import { Plugin } from '../../../../shared/models/plugin';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

@Component({
    selector: 'app-plugins-available',
    templateUrl: './plugins-available.component.html',
    styleUrls: []
})
export class PluginsAvailableComponent implements OnInit, OnDestroy {

    plugins: Plugin[];

    constructor(private pluginService: PluginService) {

    }

    ngOnInit(): void {
        this.plugins = this.pluginService.all();
        this.pluginService.pluginsChanged
            .pipe(untilComponentDestroyed(this))
            .subscribe((plugins: Plugin[]) => {
                this.plugins = plugins;
            });
    }

    ngOnDestroy(): void {
    }
}
