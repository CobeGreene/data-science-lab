import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExperimentDetailsComponent } from './experiment-details';
import { ExperimentCreatingComponent } from './experiment-creating/experiment-creating';
import { ExperimentDetailsRoutingModule } from './experiment-details-routing.module';

@NgModule({
    declarations: [
        ExperimentDetailsComponent,
        ExperimentCreatingComponent 
    ],
    imports: [
        CommonModule,
        ExperimentDetailsRoutingModule
    ], 
    providers: [

    ]
})
export class ExperimentDetailsModule {

}
