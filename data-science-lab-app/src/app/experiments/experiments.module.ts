import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExperimentsComponent } from './experiments.component';
import { ExperimentsRoutingModule } from './experiments-routing.module';
import { ExperimentStartupComponent } from './experiments-startup/experiment-startup';
import { ExperimentDetailsModule } from './experiment-details/experiment-details.module';

@NgModule({
    declarations: [
        ExperimentsComponent,
        ExperimentStartupComponent
    ],
    imports: [
        CommonModule,
        ExperimentsRoutingModule,
        ExperimentDetailsModule 
    ],
    providers: [

    ]
})
export class ExperimentsModule {

}

