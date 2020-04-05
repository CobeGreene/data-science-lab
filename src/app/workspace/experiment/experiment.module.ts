import { NgModule } from '@angular/core';
import { ExperimentComponent } from './experiment.component';
import { SharedModule } from '../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { ExperimentRoutingModule } from './experiment-routing.module';
import { ExperimentHeaderComponent } from './experiment-header/experiment-header.component';
import { ExperimentTitleComponent } from './experiment-header/experiment-title/experiment-title.component';
import { ExperimentNavigationComponent } from './experiment-header/experiment-navigation/experiment-navigation.component';
import { ExperimentBodyComponent } from './experiment-body/experiment-body.component';
import { ExperimentDatasetsComponent } from './experiment-datasets/experiment-datasets.component';
import { ExperimentDatasetCardComponent } from './experiment-datasets/experiment-dataset-card/experiment-dataset-card.component';
import {
    ExperimentCreateDatasetCardComponent
} from './experiment-datasets/experiment-create-dataset-card/experiment-create-dataset-card.component';
import { ExperimentAlgorithmsComponent } from './experiment-algorithms/experiment-algorithms.component';
import { ExperimentAlgorithmCardComponent } from './experiment-algorithms/experiment-algorithm-card/experiment-algorithm-card.component';
import {
    ExperimentCreateAlgorithmCardComponent
} from './experiment-algorithms/experiment-create-algorithm-card/experiment-create-algorithm-card.component';
import { ExperimentVisualsComponent } from './experiment-visuals/experiment-visuals.component';
import { ExperimentVisualsMenuComponent } from './experiment-visuals/experiment-visuals-menu/experiment-visuals-menu.component';
import { ExperimentVisualsGridComponent } from './experiment-visuals/experiment-visuals-grid/experiment-visuals-grid.component';
import { ExperimentVisualsWorkspaceComponent } from './experiment-visuals/experiment-visuals-workspace/experiment-visuals-workspace.component';
import { ExperimentVisualWorkspaceCardComponent } from './experiment-visuals/experiment-visuals-workspace/experiment-visual-workspace-card/experiment-visual-workspace-card.component';

@NgModule({
    declarations: [
        ExperimentComponent,
        ExperimentHeaderComponent,
        ExperimentTitleComponent,
        ExperimentNavigationComponent,
        ExperimentBodyComponent,
        ExperimentDatasetsComponent,
        ExperimentDatasetCardComponent,
        ExperimentCreateDatasetCardComponent,
        ExperimentAlgorithmsComponent,
        ExperimentAlgorithmCardComponent,
        ExperimentCreateAlgorithmCardComponent,
        ExperimentVisualsComponent,
        ExperimentVisualsMenuComponent,
        ExperimentVisualsGridComponent,
        ExperimentVisualsWorkspaceComponent,
        ExperimentVisualWorkspaceCardComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        ExperimentRoutingModule
    ]
})
export class ExperimentModule {

}
