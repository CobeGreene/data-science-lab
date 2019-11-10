import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExperimentDetailsComponent } from './experiment-details.component';
import { ExperimentDataGroupsComponent } from './experiment-data-groups/experiment-data-groups.component';


const experimentDetailsRoutes: Routes = [
    { path: 'experiment/details/:id', component: ExperimentDetailsComponent, children: [
        { path: '', component: ExperimentDataGroupsComponent, pathMatch: 'full' },
        { path: 'data-groups', component: ExperimentDataGroupsComponent },
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
