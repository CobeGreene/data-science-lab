import { Component, OnInit, OnDestroy } from '@angular/core';

import { PluginService } from '../../services/plugin-services/plugin.service';
import { Plugin } from '../../../../shared/models/plugin';

@Component({
    selector: 'app-plugins-installed',
    templateUrl: './plugins-installed.component.html',
    styleUrls: []
})
export class PluginsInstalledComponent implements OnInit, OnDestroy {

    constructor(private pluginService: PluginService) {

    }

    ngOnInit(): void {

    }

    ngOnDestroy(): void {

    }
}