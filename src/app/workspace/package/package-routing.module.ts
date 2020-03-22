import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PackageComponent } from './package.component';
import { PackageExplorerComponent } from './package-explorer/package-explorer.component';
import { PackageDetailsComponent } from './package-details/package-details.component';

const routes: Routes = [
    {
        path: '', component: PackageComponent, children: [
            { path: '', component: PackageExplorerComponent, pathMatch: 'full' },
            { path: ':name', component: PackageDetailsComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PackageRoutingModule {

}

