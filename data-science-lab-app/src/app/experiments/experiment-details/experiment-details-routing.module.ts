import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExperimentSetupFetchComponent  } from './experiment-setup-fetch/experiment-setup-fetch.component';

const experimentDetailsRoutes: Routes = [
    { path: 'experiments/details/:id/setup-fetch', component: ExperimentSetupFetchComponent },
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
