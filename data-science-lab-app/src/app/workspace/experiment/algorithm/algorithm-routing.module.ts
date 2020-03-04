import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AlgorithmComponent } from './algorithm.component';
import { AlgorithmDatasetCreateComponent } from './algorithm-dataset-create/algorithm-dataset-create.component';
import { AlgorithmSelectCreateComponent } from './algorithm-select-create/algorithm-select-create.component';
import { AlgorithmInputsCreateComponent } from './algorithm-inputs-create/algorithm-inputs-create.component';
import { AlgorithmSetupCreateComponent } from './algorithm-setup-create/algorithm-setup-create.component';


const routes: Routes = [
    {
        path: '', component: AlgorithmComponent, children: [
            { path: 'create/dataset', component: AlgorithmDatasetCreateComponent },
            { path: 'create/:sessionId/select', component: AlgorithmSelectCreateComponent },
            { path: 'create/:sessionId/input', component: AlgorithmInputsCreateComponent },
            { path: 'create/:sessionId/setup', component: AlgorithmSetupCreateComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AlgorithmRoutingModule {

}


