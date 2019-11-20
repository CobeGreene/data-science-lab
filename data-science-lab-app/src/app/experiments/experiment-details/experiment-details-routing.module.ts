import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExperimentDetailsComponent } from './experiment-details.component';
import { ExperimentDataWorkspaceComponent } from './experiment-data-workspace/experiment-data-workspace.component';
import { ExperimentSelectFetchComponent } from './experiment-select-fetch/experiment-select-fetch.component';
import { ExperimentSetupFetchComponent } from './experiment-setup-fetch/experiment-setup-fetch.component';
import { ExperimentSelectTransformComponent } from './experiment-select-transform/experiment-select-transform.component';
import { ExperimentInputTransformComponent } from './experiment-input-transform/experiment-input-transform.component';
import { ExperimentSetupTransformComponent } from './experiment-setup-transform/experiment-setup-transform.component';

const experimentDetailsRoutes: Routes = [
    {
        path: 'experiments/details/:id', component: ExperimentDetailsComponent, children: [
            { path: '', component: ExperimentDataWorkspaceComponent, pathMatch: 'full' },
            { path: 'data-workspace', component: ExperimentDataWorkspaceComponent },
            { path: 'select-fetch', component: ExperimentSelectFetchComponent },
            { path: 'setup-fetch', component: ExperimentSetupFetchComponent },
            { path: 'select-transform/:dataGroupId', component: ExperimentSelectTransformComponent },
            { path: 'input-transform/:dataGroupId', component: ExperimentInputTransformComponent },
            { path: 'setup-transform/:dataGroupId', component: ExperimentSetupTransformComponent }
        ]
    }
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
