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
import { ExperimentOptionsComponent } from './experiment-options/experiment-options.component';
import { ExperimentCheckboxOptionComponent } from './experiment-options/experiment-checkbox-option/experiment-checkbox-option.component';
import { ExperimentChoicesOptionComponent } from './experiment-options/experiment-choices-option/experiment-choices-option.component';
import { ExperimentCommandOptionComponent } from './experiment-options/experiment-command-option/experiment-command-option.component';
import { ExperimentNumberOptionComponent } from './experiment-options/experiment-number-option/experiment-number-option.component';
import { ExperimentTextOptionComponent } from './experiment-options/experiment-text-option/experiment-text-option.component';

@NgModule({
    declarations: [
        ExperimentDetailsComponent,
        ExperimentDataWorkspaceComponent,
        ExperimentSelectFetchComponent,
        ExperimentSetupFetchComponent,
        ExperimentFetchPluginsComponent,
        ExperimentFetchPluginCardComponent,
        ExperimentOptionsComponent,
        ExperimentCheckboxOptionComponent,
        ExperimentChoicesOptionComponent,
        ExperimentCommandOptionComponent,
        ExperimentNumberOptionComponent,
        ExperimentTextOptionComponent
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
