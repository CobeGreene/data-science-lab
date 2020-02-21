import { Component, OnInit, ElementRef, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { ThemeService } from './services/theme-service';
import { CoreAreaService } from './services/core-area-service';
import { FocusService } from './services/focus-service';
import { FocusAreas } from './constants';
import { NotificationService } from './services/notification-service/notification.service';
import { OpenLinkEvent } from '../../shared/events';
import { ErrorService } from './services/error-service';

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
    private errorService: ErrorService,
    private focusService: FocusService,
    private coreAreaService: CoreAreaService) {
  }

  ngOnInit() {
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
