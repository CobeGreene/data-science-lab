import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExperimentDetailsComponent } from './experiment-details';
import { ExperimentDetailsRoutingModule } from './experiment-details-routing.module';
import { ExperimentSetupFetchComponent } from './experiment-setup-fetch/experiment-setup-fetch.component';

@NgModule({
    declarations: [
        ExperimentDetailsComponent,
        ExperimentSetupFetchComponent
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
