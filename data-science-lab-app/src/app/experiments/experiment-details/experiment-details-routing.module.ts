import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExperimentCreatingComponent } from './experiment-creating/experiment-creating';

const experimentDetailsRoutes: Routes = [
    { path: 'experiments/details/:id', component: ExperimentCreatingComponent },
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
