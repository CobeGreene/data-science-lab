import { Component, Input } from '@angular/core';

import { Plugin } from '../../../../shared/models/plugin';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-plugin-card',
    templateUrl: './plugin-card.component.html',
    styleUrls: []
})
export class PluginCardComponent {

    @Input()
    plugin: Plugin;

    constructor(private route: ActivatedRoute, private router: Router) {

    }

    onSeeDetails(): void {
        this.router.navigate(['/plugins', 'details', this.plugin.name]);
    }

}
