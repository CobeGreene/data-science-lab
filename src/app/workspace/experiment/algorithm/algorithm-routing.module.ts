import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AlgorithmComponent } from './algorithm.component';
import { AlgorithmDatasetCreateComponent } from './algorithm-dataset-create/algorithm-dataset-create.component';
import { AlgorithmSelectCreateComponent } from './algorithm-select-create/algorithm-select-create.component';
import { AlgorithmInputsCreateComponent } from './algorithm-inputs-create/algorithm-inputs-create.component';
import { AlgorithmSetupCreateComponent } from './algorithm-setup-create/algorithm-setup-create.component';
import { AlgorithmDetailsComponent } from './algorithm-details/algorithm-details.component';
import { AlgorithmSelectTestComponent } from './algorithm-select-test/algorithm-select-test.component';
import { AlgorithmInputsTestComponent } from './algorithm-inputs-test/algorithm-inputs-test.component';
import { AlgorithmSelectVisualizeComponent } from './algorithm-select-visualize/algorithm-select-visualize.component';
import { AlgorithmInputsVisualizeComponent } from './algorithm-inputs-visualize/algorithm-inputs-visualize.component';
import { AlgorithmSetupVisualizeComponent } from './algorithm-setup-visualize/algorithm-setup-visualize.component';


const routes: Routes = [
    {
        path: '', component: AlgorithmComponent, children: [
            { path: 'create/dataset', component: AlgorithmDatasetCreateComponent },
            { path: 'create/:sessionId/select', component: AlgorithmSelectCreateComponent },
            { path: 'create/:sessionId/input', component: AlgorithmInputsCreateComponent },
            { path: 'create/:sessionId/setup', component: AlgorithmSetupCreateComponent },
            { path: ':algorithmId', component: AlgorithmDetailsComponent },
            { path: ':algorithmId/test/:sessionId/select', component: AlgorithmSelectTestComponent },
            { path: ':algorithmId/test/:sessionId/input', component: AlgorithmInputsTestComponent },
            { path: ':algorithmId/visualize/:sessionId/select', component: AlgorithmSelectVisualizeComponent },
            { path: ':algorithmId/visualize/:sessionId/input', component: AlgorithmInputsVisualizeComponent },
            { path: ':algorithmId/visualize/:sessionId/setup', component: AlgorithmSetupVisualizeComponent },
            { path: ':algorithmId/test-report', loadChildren: './test-report/test-report.module#TestReportModule' }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AlgorithmRoutingModule {

}


