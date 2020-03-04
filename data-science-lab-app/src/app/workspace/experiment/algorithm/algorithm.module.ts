import { NgModule } from '@angular/core';
import { AlgorithmComponent } from './algorithm.component';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { AlgorithmRoutingModule } from './algorithm-routing.module';
import { AlgorithmDatasetCreateComponent } from './algorithm-dataset-create/algorithm-dataset-create.component';
import { AlgorithmSelectCreateComponent } from './algorithm-select-create/algorithm-select-create.component';
import { AlgorithmInputsCreateComponent } from './algorithm-inputs-create/algorithm-inputs-create.component';
import { AlgorithmSetupCreateComponent } from './algorithm-setup-create/algorithm-setup-create.component';



@NgModule({
    declarations: [
        AlgorithmComponent,
        AlgorithmDatasetCreateComponent,
        AlgorithmSelectCreateComponent,
        AlgorithmInputsCreateComponent,
        AlgorithmSetupCreateComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
        AlgorithmRoutingModule
    ]
})
export class AlgorithmModule {

}

