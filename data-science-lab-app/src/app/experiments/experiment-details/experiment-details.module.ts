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
import { ExperimentDataGroupListComponent } from './experiment-data-workspace/experiment-data-group-list/experiment-data-group-list.component';
import { ExperimentPreviewDataGroupComponent } from './experiment-data-workspace/experiment-preview-data-group/experiment-preview-data-group.component';
import { ExperimentSelectTransformComponent } from './experiment-select-transform/experiment-select-transform.component';
import { ExperimentSelectTransformPluginsComponent } from './experiment-select-transform/experiment-select-transform-plugins/experiment-select-transform-plugins.component';
import { ExperimentSelectTransformPluginCardComponent } from './experiment-select-transform/experiment-select-transform-plugin-card/experiment-select-transform-plugin-card.component';
import { ExperimentInputTransformComponent } from './experiment-input-transform/experiment-input-transform.component';
import { ExperimentInputsComponent } from './experiment-inputs/experiment-inputs.component';
import { SelectTransformTypePipe } from '../../pipes/select-transfrom-type.pipe';
import { ExperimentSetupTransformComponent } from './experiment-setup-transform/experiment-setup-transform.component';
import { ExperimentAlgorithmWorkspaceComponent } from './experiment-algorithm-workspace/experiment-algorithm-workspace.component';
import { ExperimentNavigateWorkspaceComponent } from './experiment-navigate-workspace/experiment-navigate-workspace.component';
import { ExperimentSelectDataAlgorithmComponent } from './experiment-select-data-algorithm/experiment-select-data-algorithm.component';
import { ExperimentSelectDataGroupComponent } from './experiment-select-data-algorithm/experiment-select-data-group/experiment-select-data-group.component';
import { ExperimentSelectAlgorithmComponent } from './experiment-select-algorithm/experiment-select-algorithm.component';
import { ExperimentSelectAlgorithmPluginsComponent } from './experiment-select-algorithm/experiment-select-algorithm-plugins/experiment-select-algorithm-plugins.component';
import { ExperimentSelectAlgorithmPluginCardComponent } from './experiment-select-algorithm/experiment-select-algorithm-plugin-card/experiment-select-algorithm-plugin-card.component';
import { ExperimentInputAlgorithmComponent } from './experiment-input-algorithm/experiment-input-algorithm.component';
import { ExperimentSetupAlgorithmComponent } from './experiment-setup-algorithm/experiment-setup-algorithm.component';
import { ExperimentAlgorithmListComponent } from './experiment-algorithm-workspace/experiment-algorithm-list/experiment-algorithm-list.component';
import { ExperimentAlgorithmCardComponent } from './experiment-algorithm-workspace/experiment-algorithm-card/experiment-algorithm-card.component';
import { ExperimentAlgorithmDetailsComponent } from './experiment-algorithm-details/experiment-algorithm-details.component';
import { ExperimentSetupDataVisualizationComponent } from './experiment-setup-data-visualization/experiment-setup-data-visualization.component';
import { ExperimentSelectDataVisualizationComponent } from './experiment-select-data-visualization/experiment-select-data-visualization.component';
import { ExperimentSelectVisualizationPluginsComponent } from './experiment-select-data-visualization/experiment-select-visualization-plugins/experiment-select-visualization-plugins.component';
import { ExperimentSelectVisualizationPluginCardComponent } from './experiment-select-data-visualization/experiment-select-visualization-plugin-card/experiment-select-visualization-plugin-card.component';
import { ExperimentInputDataVisualizationComponent } from './experiment-input-data-visualization/experiment-input-data-visualization.component';
import { ExperimentVisualizationWorkspaceComponent } from './experiment-visualization-workspace/experiment-visualization-workspace.component';
import { ExperimentVisualizationCardComponent } from './experiment-visualization-workspace/experiment-visualization-card/experiment-visualization-card.component';
import { ExperimentVisualizationListComponent } from './experiment-visualization-workspace/experiment-visualization-list/experiment-visualization-list.component';
import { ExperimentAlgorithmInputsComponent } from './experiment-algorithm-inputs/experiment-algorithm-inputs.component';
import { ExperimentInputAlgorithmVisualizationComponent } from './experiment-input-algorithm-visualization/experiment-input-algorithm-visualization.component';
import { ExperimentSelectAlgorithmVisualizationComponent } from './experiment-select-algorithm-visualization/experiment-select-algorithm-visualization.component';
import { ExperimentSetupAlgorithmVisualizationComponent } from './experiment-setup-algorithm-visualization/experiment-setup-algorithm-visualization.component';
import {
    ExperimentAlgorithmTestingDataGroupComponent
} from './experiment-algorithm-testing-data-group/experiment-algorithm-testing-data-group.component';

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
        ExperimentTextOptionComponent,
        ExperimentDataGroupListComponent,
        ExperimentPreviewDataGroupComponent,
        ExperimentSelectTransformComponent,
        ExperimentSelectTransformPluginsComponent,
        ExperimentSelectTransformPluginCardComponent,
        ExperimentInputTransformComponent,
        ExperimentInputsComponent,
        ExperimentSetupTransformComponent,
        SelectTransformTypePipe,
        ExperimentAlgorithmWorkspaceComponent,
        ExperimentNavigateWorkspaceComponent,
        ExperimentSelectDataAlgorithmComponent,
        ExperimentSelectDataGroupComponent,
        ExperimentSelectAlgorithmComponent,
        ExperimentSelectAlgorithmPluginsComponent,
        ExperimentSelectAlgorithmPluginCardComponent,
        ExperimentInputAlgorithmComponent,
        ExperimentSetupAlgorithmComponent,
        ExperimentAlgorithmListComponent,
        ExperimentAlgorithmCardComponent,
        ExperimentAlgorithmDetailsComponent,
        ExperimentSetupDataVisualizationComponent,
        ExperimentSelectDataVisualizationComponent,
        ExperimentSelectVisualizationPluginsComponent,
        ExperimentSelectVisualizationPluginCardComponent,
        ExperimentInputDataVisualizationComponent,
        ExperimentVisualizationWorkspaceComponent,
        ExperimentVisualizationCardComponent,
        ExperimentVisualizationListComponent,
        ExperimentAlgorithmInputsComponent,
        ExperimentInputAlgorithmVisualizationComponent,
        ExperimentSelectAlgorithmVisualizationComponent,
        ExperimentSetupAlgorithmVisualizationComponent,
        ExperimentAlgorithmTestingDataGroupComponent
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
