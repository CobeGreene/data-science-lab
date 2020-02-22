import { Component, OnInit, ElementRef, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { ThemeService } from './services/theme-service';
import { CoreAreaService } from './services/core-area-service';
import { FocusService } from './services/focus-service';
import { FocusAreas } from './constants';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { NotificationService } from './services/notification-service/notification.service';
import { Settings } from '../../shared/settings';
import { ErrorService } from './services/error-service';
import { UserSettingService } from './services/user-setting-service';

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
    private coreAreaService: CoreAreaService) {
  }

  ngOnInit() {

    this.userSettingService.settingsChanged
      .pipe(untilComponentDestroyed(this))
      .subscribe(() => {
        const value = this.userSettingService.findOrDefault(Settings.SidebarLocation);
        if (value) {
          this.rightSidebar = value.value === 'right';
        } else {
          this.rightSidebar = true;
        }
      });

    const setting = this.userSettingService.findOrDefault(Settings.SidebarLocation);
    if (setting) {
      this.rightSidebar = setting.value === 'right';
    } else {
      this.rightSidebar = true;
    }
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
