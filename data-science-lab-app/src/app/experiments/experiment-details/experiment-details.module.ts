// tslint:disable: max-line-length
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExperimentDetailsComponent } from './experiment-details.component';
import { ExperimentDetailsRoutingModule } from './experiment-details-routing.module';
import { ExperimentDataWorkspaceComponent } from './experiment-data-workspace/experiment-data-workspace.component';
import { ExperimentSelectFetchComponent } from './experiment-select-fetch/experiment-select-fetch.component';
import { ExperimentSetupFetchComponent } from './experiment-setup-fetch/experiment-setup-fetch.component';
import { ExperimentFetchPluginsComponent } from './experiment-select-fetch/experiment-fetch-plugins/experiment-fetch-plugins.component';
import { ExperimentFetchPluginCardComponent } from './experiment-select-fetch/experiment-fetch-plugin-card/experiment-fetch-plugin-card.component';


@NgModule({
    declarations: [
        ExperimentDetailsComponent,
        ExperimentDataWorkspaceComponent,
        ExperimentSelectFetchComponent,
        ExperimentSetupFetchComponent,
        ExperimentFetchPluginsComponent,
        ExperimentFetchPluginCardComponent,
    ],
    imports: [
        CommonModule,
        ExperimentDetailsRoutingModule,
        FormsModule
    ],
    providers: [

    ]
})
export class ExperimentDetailsModule {

}
