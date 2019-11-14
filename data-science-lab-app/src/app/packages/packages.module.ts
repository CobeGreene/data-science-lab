import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PackageService, AppPackageService } from '../services';
import { PackageCardComponent } from './package-card/package-card.component';
import { PackageDetailsComponent } from './package-details/package-details.component';
import { PackagesSidebarComponent } from './packages-sidebar/packages-sidebar.component';
import { PackagesRoutingModule } from './packages-routing.module';
import { PackagesComponent } from './packages.component';
import { PackagesListComponent } from './packages-list/packages-list.component';
import { InstallOnlyPackagesPipe } from '../pipes/install-only-packages.pipe';
import { FilterPackagesPipe } from '../pipes/filter-packages.pipe';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        PackageCardComponent,
        PackageDetailsComponent,
        PackagesSidebarComponent,
        PackagesComponent,
        PackagesListComponent,
        InstallOnlyPackagesPipe,
        FilterPackagesPipe,
    ],
    imports: [
        CommonModule,
        PackagesRoutingModule,
        FormsModule
    ],
    providers: [
        { provide: PackageService, useClass: AppPackageService }
    ]
})
export class PackagesModule {

}
