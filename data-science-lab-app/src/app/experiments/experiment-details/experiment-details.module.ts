import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExperimentDetailsComponent } from './experiment-details';
import { ExperimentDetailsRoutingModule } from './experiment-details-routing.module';
import { ExperimentSetupFetchComponent } from './experiment-setup-fetch/experiment-setup-fetch.component';
import { ExperimentSelectFetchComponent } from './experiment-select-fetch/experiment-select-fetch.component';
import { ExperimentSelectAlgorithmComponent } from './experiment-select-algorithm/experiment-select-algorithm.component';
import { ExperimentSetupAlgorithmComponent } from './experiment-setup-algorithm/experiment-setup-algorithm.component';
import { ExperimentTrainAlgorithmComponent } from './experiment-train-algorithm/experiment-train-algorithm.component';
import { ExperimentTestAlgorithmComponent } from './experiment-test-algorithm/experiment-test-algorithm.component';


@NgModule({
    declarations: [
        ExperimentDetailsComponent,
        ExperimentSetupFetchComponent,
        ExperimentSelectFetchComponent,
        ExperimentSelectAlgorithmComponent,
        ExperimentSetupAlgorithmComponent,
        ExperimentTrainAlgorithmComponent,
        ExperimentTestAlgorithmComponent
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
