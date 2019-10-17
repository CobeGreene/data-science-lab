import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Plugin } from '../../../../shared/models/plugin';
import { PluginService } from '../../services/plugin-services/plugin.service';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

@Component({
    selector: 'app-plugins-installed',
    templateUrl: './plugins-installed.component.html',
    styleUrls: []
})
export class PluginsInstalledComponent implements OnInit, OnDestroy {

    plugins: Plugin[];

    constructor(private pluginService: PluginService) {

    }

    ngOnInit(): void {
        this.plugins = this.getInstalledPlugin(this.pluginService.all());
        this.pluginService.pluginsChanged
            .pipe(untilComponentDestroyed(this))    
            .subscribe((plugins: Plugin[]) => {
                this.plugins = this.getInstalledPlugin(plugins);
           });
    }

    ngOnDestroy(): void {
    }

    public getInstalledPlugin(plugins: Plugin[]) {
        return plugins.filter((plugin: Plugin) => {
            return plugin.install;
        });
    }
}
