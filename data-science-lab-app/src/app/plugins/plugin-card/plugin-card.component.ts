import { Component, Input } from '@angular/core';

import { Plugin } from '../../../../shared/models/plugin';

@Component({
    selector: 'app-plugin-card',
    templateUrl: './plugin-card.component.html',
    styleUrls: []
})
export class PluginCardComponent {

    @Input()
    plugin: Plugin;

}
