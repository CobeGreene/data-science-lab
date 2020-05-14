import { NgZone } from '@angular/core';

export class MockZone extends NgZone {
    run(fn: () => any): any { return fn(); }
}
