import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PackagesComponent } from './packages.component';
import { PackageDetailsComponent } from './package-details/package-details.component';
import { PackagesListComponent } from './packages-list/packages-list.component';

const packagesRoutes: Routes = [
    { path: 'packages', component: PackagesComponent, children: [
        { path: 'details/:name', component: PackageDetailsComponent },
        { path: '', redirectTo: '/packages/available', pathMatch: 'full' },
        { path: ':install', component: PackagesListComponent }
    ]}
];

@NgModule({
    imports: [
        RouterModule.forChild(packagesRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class PackagesRoutingModule {

}
