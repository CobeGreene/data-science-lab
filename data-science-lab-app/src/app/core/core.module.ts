import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { AppShortcutService, ShortcutService } from '../services/shortcut-service';
import { ReportComponent } from './areas/report/report.component';
import { SidebarComponent } from './areas/sidebar/sidebar.component';
import { WorkspaceAreaComponent } from './areas/workspace-area/workspace-area.component';
import { ThemeService } from '../services/theme-service/theme.service';
import { AppThemeService } from '../services/theme-service/app-theme.service';
import { Messenger } from '../services/messenger';
import { IpcService } from '../../../shared/services';
import { AppIpcService } from '../services/ipc-service/app-ipc.service';
import { TabsComponent } from './areas/tabs/tabs.component';
import { CoreAreaService } from '../services/core-area-service/core-area.service';
import { AppCoreAreaService } from '../services/core-area-service/app-core-area.service';
import { AppFocusService, FocusService } from '../services/focus-service';
import { ShortcutComponent } from './shortcut/shortcut.component';
import { OverlayService, AppOverlayService } from '../services/overlay-service';
import { SidebarExperimentComponent } from './areas/sidebar/sidebar-experiment/sidebar-experiment.component';
import { SidebarHeaderComponent } from './areas/sidebar/sidebar-header/sidebar-header.component';
import { SidebarListBodyComponent } from './areas/sidebar/sidebar-list-body/sidebar-list-body.component';
import { SidebarListCardComponent } from './areas/sidebar/sidebar-list-card/sidebar-list-card.component';
import { SidebarListHeaderComponent } from './areas/sidebar/sidebar-list-header/sidebar-list-header.component';
import {
    SidebarExperimentCreateComponent
} from './areas/sidebar/sidebar-experiment/sidebar-experiment-create/sidebar-experiment-create.component';
import {
    SidebarExperimentCardComponent
} from './areas/sidebar/sidebar-experiment/sidebar-experiment-card/sidebar-experiment-card.component';
import { ExperimentService } from '../services/experiment-service/experiment.service';
import { AppExperimentService } from '../services/experiment-service/app-experiment.service';
import { SidebarService, AppSidebarService } from '../services/sidebar-service';

@NgModule({
    declarations: [
        ReportComponent,
        SidebarComponent,
        WorkspaceAreaComponent,
        TabsComponent,
        ShortcutComponent,
        SidebarExperimentComponent,
        SidebarHeaderComponent,
        SidebarListBodyComponent,
        SidebarListCardComponent,
        SidebarListHeaderComponent,
        SidebarExperimentCreateComponent,
        SidebarExperimentCardComponent
    ],
    imports: [
        SharedModule,
    ],
    exports: [
        ReportComponent,
        SidebarComponent,
        TabsComponent,
        ShortcutComponent,
        WorkspaceAreaComponent
    ],
    providers: [
        { provide: ShortcutService, useClass: AppShortcutService },
        { provide: IpcService, useClass: AppIpcService },
        { provide: Messenger, useClass: Messenger },
        { provide: ThemeService, useClass: AppThemeService },
        { provide: CoreAreaService, useClass: AppCoreAreaService },
        { provide: FocusService, useClass: AppFocusService },
        { provide: OverlayService, useClass: AppOverlayService },
        { provide: ExperimentService, useClass: AppExperimentService },
        { provide: SidebarService, useClass: AppSidebarService }
    ]
})
export class CoreModule {

}
