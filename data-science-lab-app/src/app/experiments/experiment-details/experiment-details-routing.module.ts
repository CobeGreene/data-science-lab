import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExperimentSetupFetchComponent } from './experiment-setup-fetch/experiment-setup-fetch.component';
import { ExperimentSelectFetchComponent } from './experiment-select-fetch/experiment-select-fetch.component';
import { ExperimentSelectAlgorithmComponent } from './experiment-select-algorithm/experiment-select-algorithm.component';
import { ExperimentSetupAlgorithmComponent } from './experiment-setup-algorithm/experiment-setup-algorithm.component';
import { ExperimentTrainAlgorithmComponent } from './experiment-train-algorithm/experiment-train-algorithm.component';
import { ExperimentTestAlgorithmComponent } from './experiment-test-algorithm/experiment-test-algorithm.component';

const experimentDetailsRoutes: Routes = [
    { path: 'experiments/details/:id/select-fetch', component: ExperimentSelectFetchComponent },
    { path: 'experiments/details/:id/setup-fetch', component: ExperimentSetupFetchComponent },
    { path: 'experiments/details/:id/select-algorithm', component: ExperimentSelectAlgorithmComponent },
    { path: 'experiments/details/:id/setup-algorithm', component: ExperimentSetupAlgorithmComponent },
    { path: 'experiments/details/:id/train-algorithm', component: ExperimentTrainAlgorithmComponent },
    { path: 'experiments/details/:id/test-algorithm', component: ExperimentTestAlgorithmComponent },
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
