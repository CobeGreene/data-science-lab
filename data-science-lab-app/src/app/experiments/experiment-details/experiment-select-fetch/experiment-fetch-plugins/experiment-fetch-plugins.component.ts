import { Component, OnInit, OnDestroy } from '@angular/core';
import { Plugin } from '../../../../../../shared/models';

@Component({
    selector: 'app-experiment-fetch-plugins',
    templateUrl: './experiment-fetch-plugins.component.html',
    styleUrls: []
})
export class ExperimentFetchPluginsComponent implements OnInit, OnDestroy {

    plugins: Plugin[];

    constructor() {

    }

    ngOnInit() {
        this.plugins = [
            new Plugin({name: 'name', className: 'className',
                        description: 'desc', type: 'FETCH', packageName: 'packageName'}),
            new Plugin({name: 'name 2', className: 'className',
                        description: 'desc', type: 'FETCH', packageName: 'packageName'}),
            new Plugin({name: 'name 3', className: 'className',
                        description: 'desc', type: 'FETCH', packageName: 'packageName'}),
        ];
    }

    ngOnDestroy() {

    }
} 
