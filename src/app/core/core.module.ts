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
import { ExperimentService, AppExperimentService } from '../services/experiment-service';
import { SidebarService, AppSidebarService } from '../services/sidebar-service';
import { NotificationService, AppNotificationService } from '../services/notification-service';
import { ErrorService, AppErrorService } from '../services/error-service';
import { TabCardComponent } from './areas/tabs/tab-card/tab-card.component';
import { TabOptionsComponent } from './areas/tabs/tab-options/tab-options.component';
import { RouterService, AppRouterService } from '../services/router-service';
import { TabService, AppTabService } from '../services/tab-service';
import { TabFactory, AppTabFactory } from '../factory/tab-factory';
import { UserSettingService, AppUserSettingService } from '../services/user-setting-service';
import { CreationService } from '../services/creation-service/creation.service';
import { AppCreationService } from '../services/creation-service/app-creation.service';
import { SidebarPackageComponent } from './areas/sidebar/sidebar-package/sidebar-package.component';
import { SidebarPackageCardComponent } from './areas/sidebar/sidebar-package/sidebar-package-card/sidebar-package-card.component';
import { PackageService, AppPackageService } from '../services/package-service';
import {
    SidebarPackageExplorerComponent
} from './areas/sidebar/sidebar-package/sidebar-package-explorer/sidebar-package-explorer.component';
import { AppOpenLinkService, OpenLinkService } from '../services/open-link-service';
import { FetchSessionService, AppFetchSessionService } from '../session-services/fetch-session-service';
import { AppTransformSessionService, TransformSessionService } from '../session-services/transform-session-service';
import { DatasetService, AppDatasetService } from '../services/dataset-service';
import { AlgorithmService, AppAlgorithmService } from '../services/algorithm-service';
import { SessionPluginService, AppSessionPluginService } from '../services/session-plugin-service';
import { AlgorithmSessionService, AppAlgorithmSessionService } from '../session-services/algorithm-session-service';
import { AppTrackerService } from '../services/tracker-service/app-tracker.service';
import { TrackerService } from '../services/tracker-service/tracker.service';
import { TestReportService, AppTestReportService } from '../services/test-report-service';
import { TestReportSessionService, AppTestReportSessionService } from '../session-services/test-report-session-service';
import { DatasetVisualSessionService, AppDatasetVisualSessionService } from '../session-services/dataset-visual-session-service';
import { VisualizationService, AppVisualizationService } from '../services/visualization-service';
import { AppAlgorithmVisualSessionService, AlgorithmVisualSessionService } from '../session-services/algorithm-visual-session-service';
import { SidebarAlgorithmStopComponent } from './areas/sidebar/sidebar-algorithm/sidebar-algorithm-stop/sidebar-algorithm-stop.component';
import { SidebarAlgorithmStartComponent } from './areas/sidebar/sidebar-algorithm/sidebar-algorithm-start/sidebar-algorithm-start.component';
import { SidebarAlgorithmCardComponent } from './areas/sidebar/sidebar-algorithm/sidebar-algorithm-card/sidebar-algorithm-card.component';
import { SidebarAlgorithmComponent } from './areas/sidebar/sidebar-algorithm/sidebar-algorithm.component';

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
        SidebarExperimentCardComponent,
        TabCardComponent,
        TabOptionsComponent,
        SidebarPackageComponent,
        SidebarPackageCardComponent,
        SidebarPackageExplorerComponent,
        SidebarAlgorithmComponent,
        SidebarAlgorithmStopComponent,
        SidebarAlgorithmStartComponent,
        SidebarAlgorithmCardComponent,
    ],
    imports: [
        SharedModule,
    ],
    exports: [
        ReportComponent,
        SidebarComponent,
        TabsComponent,
        ShortcutComponent,
        WorkspaceAreaComponent,
    ],
    providers: [
        { provide: ShortcutService, useClass: AppShortcutService },
        { provide: IpcService, useClass: AppIpcService },
        { provide: Messenger, useClass: Messenger },
        { provide: RouterService, useClass: AppRouterService },
        { provide: TabService, useClass: AppTabService },
        { provide: TabFactory, useClass: AppTabFactory },
        { provide: ThemeService, useClass: AppThemeService },
        { provide: CoreAreaService, useClass: AppCoreAreaService },
        { provide: FocusService, useClass: AppFocusService },
        { provide: OverlayService, useClass: AppOverlayService },
        { provide: ExperimentService, useClass: AppExperimentService },
        { provide: DatasetService, useClass: AppDatasetService },
        { provide: AlgorithmService, useClass: AppAlgorithmService },
        { provide: TrackerService, useClass: AppTrackerService },
        { provide: PackageService, useClass: AppPackageService },
        { provide: TestReportService, useClass: AppTestReportService },
        { provide: SessionPluginService, useClass: AppSessionPluginService },
        { provide: TestReportSessionService, useClass: AppTestReportSessionService },
        { provide: SidebarService, useClass: AppSidebarService },
        { provide: FetchSessionService, useClass: AppFetchSessionService },
        { provide: VisualizationService, useClass: AppVisualizationService },
        { provide: TransformSessionService, useClass: AppTransformSessionService },
        { provide: DatasetVisualSessionService, useClass: AppDatasetVisualSessionService },
        { provide: AlgorithmVisualSessionService, useClass: AppAlgorithmVisualSessionService },
        { provide: AlgorithmSessionService, useClass: AppAlgorithmSessionService },
        { provide: NotificationService, useClass: AppNotificationService },
        { provide: ErrorService, useClass: AppErrorService },
        { provide: UserSettingService, useClass: AppUserSettingService },
        { provide: CreationService, useClass: AppCreationService },
        { provide: OpenLinkService, useClass: AppOpenLinkService },
    ]
})
export class CoreModule {

}
