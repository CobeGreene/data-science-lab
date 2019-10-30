import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExperimentSetupFetchComponent } from './experiment-setup-fetch/experiment-setup-fetch.component';
import { ExperimentSelectFetchComponent } from './experiment-select-fetch/experiment-select-fetch.component';
import { ExperimentSelectAlgorithmComponent } from './experiment-select-algorithm/experiment-select-algorithm.component';
import { ExperimentSetupAlgorithmComponent } from './experiment-setup-algorithm/experiment-setup-algorithm.component';
import { ExperimentTrainAlgorithmComponent } from './experiment-train-algorithm/experiment-train-algorithm.component';
import { ExperimentTestAlgorithmComponent } from './experiment-test-algorithm/experiment-test-algorithm.component';
import { ExperimentDetailsComponent } from './experiment-details';

const experimentDetailsRoutes: Routes = [
    { path: 'experiments/details/:id', component: ExperimentDetailsComponent, children: [
        { path: 'select-fetch', component: ExperimentSelectFetchComponent },
        { path: 'setup-fetch', component: ExperimentSetupFetchComponent },
        { path: 'select-algorithm', component: ExperimentSelectAlgorithmComponent },
        { path: 'setup-algorithm', component: ExperimentSetupAlgorithmComponent },
        { path: 'train-algorithm', component: ExperimentTrainAlgorithmComponent },
        { path: 'test-algorithm', component: ExperimentTestAlgorithmComponent },
    ]},

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
