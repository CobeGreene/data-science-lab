import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExperimentDetailsComponent } from './experiment-details.component';
import { ExperimentDataWorkspaceComponent } from './experiment-data-workspace/experiment-data-workspace.component';
import { ExperimentSelectFetchComponent } from './experiment-select-fetch/experiment-select-fetch.component';
import { ExperimentSetupFetchComponent } from './experiment-setup-fetch/experiment-setup-fetch.component';
import { ExperimentSelectTransformComponent } from './experiment-select-transform/experiment-select-transform.component';
import { ExperimentInputTransformComponent } from './experiment-input-transform/experiment-input-transform.component';
import { ExperimentSetupTransformComponent } from './experiment-setup-transform/experiment-setup-transform.component';
import { ExperimentAlgorithmWorkspaceComponent } from './experiment-algorithm-workspace/experiment-algorithm-workspace.component';
import { ExperimentSelectDataAlgorithmComponent } from './experiment-select-data-algorithm/experiment-select-data-algorithm.component';
import { ExperimentSelectAlgorithmComponent } from './experiment-select-algorithm/experiment-select-algorithm.component';
import { ExperimentInputAlgorithmComponent } from './experiment-input-algorithm/experiment-input-algorithm.component';
import { ExperimentSetupAlgorithmComponent } from './experiment-setup-algorithm/experiment-setup-algorithm.component';
import { ExperimentAlgorithmDetailsComponent } from './experiment-algorithm-details/experiment-algorithm-details.component';
import {
    ExperimentSelectVisualizationPluginsComponent
} from './experiment-select-data-visualization/experiment-select-visualization-plugins/experiment-select-visualization-plugins.component';
import {
    ExperimentInputDataVisualizationComponent
} from './experiment-input-data-visualization/experiment-input-data-visualization.component';
import {
    ExperimentSetupDataVisualizationComponent
} from './experiment-setup-data-visualization/experiment-setup-data-visualization.component';
import {
    ExperimentVisualizationWorkspaceComponent
} from './experiment-visualization-workspace/experiment-visualization-workspace.component';
import {
    ExperimentInputAlgorithmVisualizationComponent
} from './experiment-input-algorithm-visualization/experiment-input-algorithm-visualization.component';
import {
    ExperimentSelectAlgorithmVisualizationComponent
} from './experiment-select-algorithm-visualization/experiment-select-algorithm-visualization.component';
import {
    ExperimentSetupAlgorithmVisualizationComponent
} from './experiment-setup-algorithm-visualization/experiment-setup-algorithm-visualization.component';
import {
    ExperimentAlgorithmTestingDataGroupComponent
} from './experiment-algorithm-testing-data-group/experiment-algorithm-testing-data-group.component';
import {
    ExperimentAlgorithmTestingInputsComponent
} from './experiment-algorithm-testing-inputs/experiment-algorithm-testing-inputs.component';

const experimentDetailsRoutes: Routes = [
    {
        path: 'experiments/details/:id', component: ExperimentDetailsComponent, children: [
            { path: '', component: ExperimentDataWorkspaceComponent, pathMatch: 'full' },
            { path: 'data-workspace', component: ExperimentDataWorkspaceComponent },
            { path: 'algorithm-workspace', component: ExperimentAlgorithmWorkspaceComponent },
            { path: 'visualization-workspace', component: ExperimentVisualizationWorkspaceComponent },
            { path: 'select-data-algorithm', component: ExperimentSelectDataAlgorithmComponent },
            { path: 'select-fetch', component: ExperimentSelectFetchComponent },
            { path: 'setup-fetch', component: ExperimentSetupFetchComponent },
            { path: 'select-transform/:dataGroupId', component: ExperimentSelectTransformComponent },
            { path: 'input-transform/:dataGroupId', component: ExperimentInputTransformComponent },
            { path: 'setup-transform/:dataGroupId', component: ExperimentSetupTransformComponent },
            { path: 'select-algorithm/:dataGroupId', component: ExperimentSelectAlgorithmComponent },
            { path: 'input-algorithm/:dataGroupId', component: ExperimentInputAlgorithmComponent },
            { path: 'setup-algorithm/:dataGroupId', component: ExperimentSetupAlgorithmComponent },
            { path: 'algorithm/:algorithmId', component: ExperimentAlgorithmDetailsComponent },
            { path: 'select-data-visualization/:dataGroupId', component: ExperimentSelectVisualizationPluginsComponent },
            { path: 'input-data-visualization/:dataGroupId', component: ExperimentInputDataVisualizationComponent },
            { path: 'setup-data-visualization/:dataGroupId', component: ExperimentSetupDataVisualizationComponent },
            { path: 'select-algorithm-visualization/:algorithmId', component: ExperimentSelectAlgorithmVisualizationComponent },
            { path: 'input-algorithm-visualization/:algorithmId', component: ExperimentInputAlgorithmVisualizationComponent },
            { path: 'setup-algorithm-visualization/:algorithmId', component: ExperimentSetupAlgorithmVisualizationComponent },
            { path: 'algorithm-testing-datagroup/:algorithmId', component: ExperimentAlgorithmTestingDataGroupComponent },
            { path: 'algorithm-testing-input/:algorithmId', component: ExperimentAlgorithmTestingInputsComponent }
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(experimentDetailsRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class ExperimentDetailsRoutingModule {

}
