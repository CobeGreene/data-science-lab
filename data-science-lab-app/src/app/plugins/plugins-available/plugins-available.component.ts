import { Component, OnInit, OnDestroy } from '@angular/core';

import { PluginService } from '../../services/plugin-services/plugin.service';
import { Plugin } from '../../../../shared/models/plugin';

@Component({
    selector: 'app-plugins-available',
    templateUrl: './plugins-available.component.html',
    styleUrls: []
})
export class PluginsAvailableComponent implements OnInit, OnDestroy {

    constructor(private pluginService: PluginService) {

    }

    ngOnInit(): void {

    }

    ngOnDestroy(): void {

    }
}
