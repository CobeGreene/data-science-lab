// tslint:disable: max-line-length
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
import { ExperimentProgressBarComponent } from './experiment-progress-bar/experiment-progress-bar.component';
import { ExperimentSelectFetchInfoComponent } from './experiment-select-fetch/experiment-select-fetch-info/experiment-select-fetch-info.component';
import { ExperimentFetchPluginsComponent } from './experiment-select-fetch/experiment-fetch-plugins/experiment-fetch-plugins.component'
import { ExperimentFetchPluginCardComponent  } from './experiment-select-fetch/experiment-fetch-plugin-card/experiment-fetch-plugin-card.component';
import { ExperimentSetupFetchInfoComponent } from './experiment-setup-fetch/experiment-setup-fetch-info/experiment-setup-fetch-info.component';

@NgModule({
    declarations: [
        ExperimentDetailsComponent,
        ExperimentSetupFetchComponent,
        ExperimentSelectFetchComponent,
        ExperimentSelectAlgorithmComponent,
        ExperimentSetupAlgorithmComponent,
        ExperimentTrainAlgorithmComponent,
        ExperimentTestAlgorithmComponent,
        ExperimentProgressBarComponent,
        ExperimentSelectFetchInfoComponent,
        ExperimentFetchPluginsComponent,
        ExperimentFetchPluginCardComponent,
        ExperimentSetupFetchInfoComponent
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
