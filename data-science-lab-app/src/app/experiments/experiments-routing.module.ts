import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExperimentsComponent } from './experiments.component';
import { ExperimentStartupComponent } from './experiments-startup/experiments-startup.component';

const experimentsRoutes: Routes = [
    {
        path: 'experiments', component: ExperimentsComponent, children: [
            { path: '', component: ExperimentStartupComponent }
        ]
    }
];


@NgModule({
    imports: [
        RouterModule.forChild(experimentsRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class ExperimentsRoutingModule {

}


