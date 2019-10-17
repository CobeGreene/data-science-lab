import { Component, OnInit, OnDestroy } from '@angular/core';
import { PluginService } from '../../services/plugin-services/plugin.service';
import { Plugin } from '../../../../shared/models/plugin';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

@Component({
    selector: 'app-plugins-sidebar',
    templateUrl: './plugins-sidebar.component.html',
    styleUrls: []
})
export class PluginsSidebarComponent implements OnInit, OnDestroy {
    
    installedCount: number;

    constructor(private pluginService: PluginService) {
        
    }

    ngOnInit(): void {
        this.installedCount = this.getInstalledCount(this.pluginService.all());
        this.pluginService.pluginsChanged
            .pipe(untilComponentDestroyed(this))
            .subscribe((plugins: Plugin[]) => {
               this.installedCount = this.getInstalledCount(plugins);
        });
    }

    ngOnDestroy(): void {
    }

    public getInstalledCount(plugins: Plugin[]): number {
        return plugins.filter((value: Plugin) => {
            return value.install;
          }).length;
    }
}
