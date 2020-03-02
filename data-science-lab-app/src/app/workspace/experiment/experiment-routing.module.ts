import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExperimentComponent } from './experiment.component';
import { ExperimentDatasetsComponent } from './experiment-datasets/experiment-datasets.component';

const routes: Routes = [
    {
        path: ':id', component: ExperimentComponent, children: [
            { path: '', component: ExperimentDatasetsComponent, pathMatch: 'full' },
            { path: 'dataset', loadChildren: './dataset/dataset.module#DatasetModule' }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ExperimentRoutingModule {

}
