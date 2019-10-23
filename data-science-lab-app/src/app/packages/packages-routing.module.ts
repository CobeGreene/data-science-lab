import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PackagesComponent } from './packages.component';
import { PackagesAvailableComponent } from './packages-available/packages-available.component';
import { PackagesInstalledComponent } from './packages-installed/packages-installed.component';
import { PackageDetailsComponent } from './package-details/package-details.component';

const packagesRoutes: Routes = [
    { path: 'packages', component: PackagesComponent, children: [
        { path: '', component: PackagesAvailableComponent },
        { path: 'available', component: PackagesAvailableComponent },
        { path: 'installed', component: PackagesInstalledComponent },
        { path: 'details/:name', component: PackageDetailsComponent }
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
