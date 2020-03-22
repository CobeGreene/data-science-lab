import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExperimentComponent } from './experiment.component';
import { ExperimentDatasetsComponent } from './experiment-datasets/experiment-datasets.component';
import { ExperimentAlgorithmsComponent } from './experiment-algorithms/experiment-algorithms.component';
import { ExperimentVisualsComponent } from './experiment-visuals/experiment-visuals.component';

const routes: Routes = [
    {
        path: ':id', component: ExperimentComponent, children: [
            { path: '', component: ExperimentDatasetsComponent, pathMatch: 'full' },
            { path: 'algorithm', component: ExperimentAlgorithmsComponent, pathMatch: 'full' },
            { path: 'dataset', loadChildren: './dataset/dataset.module#DatasetModule' },
            { path: 'algorithm', loadChildren: './algorithm/algorithm.module#AlgorithmModule' },
            { path: 'visual', component: ExperimentVisualsComponent, pathMatch: 'full' }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ExperimentRoutingModule {

}
