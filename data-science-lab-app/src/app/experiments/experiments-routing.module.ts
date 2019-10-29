import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExperimentsComponent } from './experiments.component';

const experimentsRoutes: Routes = [
    { path: 'experiments', component: ExperimentsComponent, children: [

    ]}
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
