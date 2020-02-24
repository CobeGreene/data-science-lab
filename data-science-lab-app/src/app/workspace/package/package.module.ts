import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { PackageComponent } from './package.component';
import { PackageRoutingModule } from './package-routing.module';
import { PackageExplorerComponent } from './package-explorer/package-explorer.component';
import { PackageDetailsComponent } from './package-details/package-details.component';
import { PackageExplorerHeaderComponent } from './package-explorer/package-explorer-header/package-explorer-header.component';
import { PackageExplorerCardComponent } from './package-explorer/package-explorer-card/package-explorer-card.component';

@NgModule({
    declarations: [
        PackageComponent,
        PackageExplorerComponent,
        PackageDetailsComponent,
        PackageExplorerHeaderComponent,
        PackageExplorerCardComponent
    ], 
    imports: [
        CommonModule,
        SharedModule,
        PackageRoutingModule
    ],
    providers: [

    ]
})
export class PackageModule {

}

