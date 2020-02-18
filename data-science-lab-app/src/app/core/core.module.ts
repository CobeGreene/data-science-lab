import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { KeyboardShortcutsModule } from 'ng-keyboard-shortcuts';
import { ShortcutComponent } from './shortcut/shortcut.component';
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

@NgModule({
    declarations: [
        ShortcutComponent,
        ReportComponent,
        SidebarComponent,
        WorkspaceAreaComponent,
        TabsComponent
    ],
    imports: [
        SharedModule,
        KeyboardShortcutsModule
    ],
    exports: [
        KeyboardShortcutsModule,
        ShortcutComponent,
        ReportComponent,
        SidebarComponent,
        TabsComponent,
        WorkspaceAreaComponent
    ],
    providers: [
        { provide: ShortcutService, useClass: AppShortcutService },
        { provide: IpcService, useClass: AppIpcService },
        { provide: Messenger, useClass: Messenger },
        { provide: ThemeService, useClass: AppThemeService },
        { provide: CoreAreaService, useClass: AppCoreAreaService },
        { provide: FocusService, useClass: AppFocusService },
    ]
})
export class CoreModule {

}
