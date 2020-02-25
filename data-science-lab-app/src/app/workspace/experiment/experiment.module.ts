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

@NgModule({
    declarations: [
        ExperimentComponent,
        ExperimentHeaderComponent,
        ExperimentTitleComponent,
        ExperimentNavigationComponent,
        ExperimentBodyComponent,
        ExperimentDatasetsComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        ExperimentRoutingModule
    ]
})
export class ExperimentModule {

}
