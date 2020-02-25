import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { PackageComponent } from './package.component';
import { PackageRoutingModule } from './package-routing.module';
import { PackageExplorerComponent } from './package-explorer/package-explorer.component';
import { PackageDetailsComponent } from './package-details/package-details.component';
import { PackageExplorerHeaderComponent } from './package-explorer/package-explorer-header/package-explorer-header.component';
import { PackageExplorerCardComponent } from './package-explorer/package-explorer-card/package-explorer-card.component';
import { PackageDetailsHeaderComponent } from './package-details/package-details-header/package-details-header.component';
import { PackageDetailsActionsComponent } from './package-details/package-details-actions/package-details-actions.component';
import { PackageDetailsReadmeComponent } from './package-details/package-details-readme/package-details-readme.component';

@NgModule({
    declarations: [
        PackageComponent,
        PackageExplorerComponent,
        PackageDetailsComponent,
        PackageExplorerHeaderComponent,
        PackageExplorerCardComponent,
        PackageDetailsHeaderComponent,
        PackageDetailsActionsComponent,
        PackageDetailsReadmeComponent
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

