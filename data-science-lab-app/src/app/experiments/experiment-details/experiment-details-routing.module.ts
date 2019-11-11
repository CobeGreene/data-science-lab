import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExperimentDetailsComponent } from './experiment-details.component';
import { ExperimentDataWorkspaceComponent } from './experiment-data-workspace/experiment-data-workspace.component';

const experimentDetailsRoutes: Routes = [
    { path: 'experiments/details/:id', component: ExperimentDetailsComponent, children: [
        { path: '', component: ExperimentDataWorkspaceComponent, pathMatch: 'full' },
        { path: 'data-workspace', component: ExperimentDataWorkspaceComponent },
    ]}
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
