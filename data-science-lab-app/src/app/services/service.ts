import { OnDestroy, NgZone, Injectable, OnInit } from '@angular/core';
import { Messenger } from './messenger';

export abstract class Service implements OnDestroy {

    constructor(protected messenger: Messenger, protected zone: NgZone) {
    }  


    abstract registerEvents();
    
    abstract unregisterEvents();

    ngOnDestroy() {
        this.unregisterEvents();
    }
}
