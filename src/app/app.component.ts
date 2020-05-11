import { Component, OnInit, ElementRef, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { ThemeService } from './services/theme-service';
import { CoreAreaService } from './services/core-area-service';
import { FocusService } from './services/focus-service';
import { FocusAreas } from './constants';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { Settings } from '../../shared/settings';
import { ErrorService } from './services/error-service';
import { UserSettingService } from './services/user-setting-service';
import { CreationService } from './services/creation-service/creation.service';

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
    private focusService: FocusService,
    private userSettingService: UserSettingService,
    private coreAreaService: CoreAreaService
    ) {
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
