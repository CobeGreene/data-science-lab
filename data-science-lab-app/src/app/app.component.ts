import { Component, OnInit, ElementRef, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { ThemeService } from './services/theme-service';
import { CoreAreaService } from './services/core-area-service';
import { FocusService } from './services/focus-service';
import { FocusAreas } from './constants';
import { NotificationService } from './services/notification-service/notification.service';
import { OpenLinkEvent } from '../../shared/events';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  title = 'data-science-lab-app';

  @ViewChild('workspaceCmp', { static: false }) workspaceComponent: ElementRef<HTMLElement>;

  constructor(
    private themeService: ThemeService,
    private focusService: FocusService,
    private notificationService: NotificationService,
    private coreAreaService: CoreAreaService) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.coreAreaService.registerWorkspace(this.workspaceComponent.nativeElement);

    setTimeout(() => {
      this.notificationService.push({
        header: 'Title',
        message: 'Here is my content',
        type: 'warning',
        action: {
          event: OpenLinkEvent,
          href: 'https://www.google.com',
          label: 'Issues'
        }
      });
      this.notificationService.push({
        header: 'Error',
        message: 'Error message',
        type: 'error'
      });
    }, 1000);
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
