import { NgModule } from '@angular/core';
import { WorkspaceComponent } from './workspace.component';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { WorkspaceRoutingModule } from './workspace-routing.module';

@NgModule({
    declarations: [
        WorkspaceComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        WorkspaceRoutingModule
    ]
})
export class WorkspaceModule {

}
