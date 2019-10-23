import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PackageService, AppPackageService } from '../services';
import { PackageCardComponent } from './package-card/package-card.component';
import { PackageDetailsComponent } from './package-details/package-details.component';
import { PackagesAvailableComponent } from './packages-available/packages-available.component';
import { PackagesInstalledComponent } from './packages-installed/packages-installed.component';
import { PackagesSidebarComponent } from './packages-sidebar/packages-sidebar.component';
import { PackagesRoutingModule } from './packages-routing.module';
import { PackagesComponent } from './packages.component';

@NgModule({
    declarations: [
        PackageCardComponent,
        PackageDetailsComponent,
        PackagesAvailableComponent,
        PackagesInstalledComponent,
        PackagesSidebarComponent,
        PackagesComponent,
    ],
    imports: [
        CommonModule,
        PackagesRoutingModule
    ],
    providers: [
        {provide: PackageService, useClass: AppPackageService }
    ]
})
export class PackagesModule {

}
