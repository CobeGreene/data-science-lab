import { Component, OnInit, ElementRef, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { ThemeService } from './services/theme-service';
import { CoreAreaService } from './services/core-area-service';

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
    private coreAreaService: CoreAreaService) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.coreAreaService.registerWorkspace(this.workspaceComponent.nativeElement);
  }

  ngOnDestroy() {

  }

  onResized() {
    this.coreAreaService.resizeEvent();
  }

}
