import { NgModule } from '@angular/core';
import { WorkspaceComponent } from './workspace.component';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { WorkspaceRoutingModule } from './workspace-routing.module';
import { WelcomeComponent } from './welcome/welcome.component';
import { WorkspaceService, AppWorkspaceService } from '../services/workspace-service';
import { SettingsComponent } from './settings/settings.component';

@NgModule({
    declarations: [
        WorkspaceComponent,
        WelcomeComponent,
        SettingsComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        WorkspaceRoutingModule
    ],
    providers: [
        { provide: WorkspaceService, useClass: AppWorkspaceService }
    ]
})
export class WorkspaceModule {

}
