import { NgModule } from '@angular/core';
import { ExperimentComponent } from './experiment.component';
import { SharedModule } from '../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { ExperimentRoutingModule } from './experiment-routing.module';

@NgModule({
    declarations: [
        ExperimentComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        ExperimentRoutingModule
    ]
})
export class ExperimentModule {

}
