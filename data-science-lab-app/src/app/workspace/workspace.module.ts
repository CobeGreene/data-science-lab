import { NgModule } from '@angular/core';
import { WorkspaceComponent } from './workspace.component';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { WorkspaceRoutingModule } from './workspace-routing.module';
import { WelcomeComponent } from './welcome/welcome.component';
import { WorkspaceService, AppWorkspaceService } from '../services/workspace-service';
import { SettingsComponent } from './settings/settings.component';
import { SettingsHeaderComponent } from './settings/settings-header/settings-header.component';
import { SettingCardComponent } from './settings/setting-card/setting-card.component';
import { SettingBooleanCardComponent } from './settings/setting-card/setting-boolean-card/setting-boolean-card.component';
import { SettingStringCardComponent } from './settings/setting-card/setting-string-card/setting-string-card.component';
import { SettingNumberCardComponent } from './settings/setting-card/setting-number-card/setting-number-card.component';

@NgModule({
    declarations: [
        WorkspaceComponent,
        WelcomeComponent,
        SettingsComponent,
        SettingsHeaderComponent,
        SettingCardComponent,
        SettingBooleanCardComponent,
        SettingStringCardComponent,
        SettingNumberCardComponent
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
