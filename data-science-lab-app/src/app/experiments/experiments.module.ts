import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExperimentsComponent } from './experiments.component';
import { ExperimentsRoutingModule } from './experiments-routing.module';

@NgModule({
    declarations: [
        ExperimentsComponent
    ],
    imports: [
        CommonModule,
        ExperimentsRoutingModule
    ],
    providers: [

    ]
})
export class ExperimentsModule {

}

