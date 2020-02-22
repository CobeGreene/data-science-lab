import { Component, OnInit, ElementRef, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { ThemeService } from './services/theme-service';
import { CoreAreaService } from './services/core-area-service';
import { FocusService } from './services/focus-service';
import { FocusAreas } from './constants';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { Settings } from '../../shared/settings';
import { ErrorService } from './services/error-service';
import { UserSettingService } from './services/user-setting-service';
import { ExperimentService } from './services/experiment-service';
import { TabFactory } from './factory/tab-factory';
import { TabService } from './services/tab-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  title = 'data-science-lab-app';

  rightSidebar: boolean;

  @ViewChild('workspaceCmp', { static: false }) workspaceComponent: ElementRef<HTMLElement>;

  constructor(
    private themeService: ThemeService,
    private errorService: ErrorService,
    private focusService: FocusService,
    private userSettingService: UserSettingService,
    private coreAreaService: CoreAreaService,
    private experimentService: ExperimentService,
    private tabFactory: TabFactory,
    private tabService: TabService) {
  }

  ngOnInit() {

    this.userSettingService.settingsChanged
      .pipe(untilComponentDestroyed(this))
      .subscribe(() => {
        const setting = this.userSettingService.findOrDefault(Settings.SidebarLocation);
        this.rightSidebar = (setting) ? setting.value === 'right' : true;
      });

    const userSetting = this.userSettingService.findOrDefault(Settings.SidebarLocation);
    this.rightSidebar = (userSetting) ? userSetting.value === 'right' : true;

    this.experimentService.experimentCreated
      .pipe(untilComponentDestroyed(this))
      .subscribe((experiment) => {
        const tab = this.tabFactory.create(['experiment', experiment.id]);
        this.tabService.openTab(tab);
      });
  }

  ngAfterViewInit() {
    this.coreAreaService.registerWorkspace(this.workspaceComponent.nativeElement);
  }

  ngOnDestroy() {

  }

  onFocusWorkspace(event: Event) {
    this.focusService.set(FocusAreas.Workspace);
    event.preventDefault();
  }

  onResized() {
    this.coreAreaService.resizeEvent();
  }

}
