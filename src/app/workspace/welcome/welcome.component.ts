import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { FocusService } from '../../services/focus-service';
import { WorkspaceService } from '../../services/workspace-service';
import { ShortcutService } from '../../services/shortcut-service';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { FocusAreas } from '../../constants';
import { ModalComponent } from '../../shared/modal/modal.component';
import { TabService } from '../../services/tab-service';
import { RouterService } from '../../services/router-service';
import { TabFactory } from '../../factory/tab-factory';
import { Tab } from '../../models';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit, OnDestroy, AfterViewInit {

  inFocus: boolean;
  selected: number;

  @ViewChild('createCmp', { static: false }) createComponent: ModalComponent;
  @ViewChild('loadCmp', { static: false }) loadComponent: ModalComponent;

  constructor(
    private focusService: FocusService,
    private workspaceService: WorkspaceService,
    private shortcutService: ShortcutService,
    private routerService: RouterService,
    private tabService: TabService,
    private tabFactory: TabFactory,
  ) { }

  ngOnInit() {
    this.focusService.focusChanged
      .pipe(untilComponentDestroyed(this))
      .subscribe((value) => {
        this.inFocus = value === FocusAreas.Workspace;
      });
    this.inFocus = this.focusService.current() === FocusAreas.Workspace;
    this.selected = this.workspaceService.get('/welcome', { selected: 0 }).selected;
  }

  ngAfterViewInit() {
    this.shortcutService.subscribe('arrowup', this.onMoveUp);
    this.shortcutService.subscribe('arrowdown', this.onMoveDown);
    this.shortcutService.subscribe('enter', this.onEnter);
  }

  onMoveUp = () => {
    if (this.inFocus) {
      if (this.selected > 0) {
        this.selected -= 1;
      } else {
        this.selected = 5;
      }
    }
  }

  onMoveDown = () => {
    if (this.inFocus) {
      if (this.selected < 5) {
        this.selected += 1;
      } else {
        this.selected = 0;
      }
    }
  }

  onEnter = () => {
    if (this.inFocus) {
      if (this.selected === 0) {
        this.onCreateExperiment(new MouseEvent('click'));
      } else if (this.selected === 1) {
        this.onLoadExperiment(new MouseEvent('click'));
      } else if (this.selected === 2) {
        this.onGoToPackages();
      } else if (this.selected === 4) {
        this.onGoToSettings();
      }
    }
  }

  onCreateExperiment(event: MouseEvent) {
    this.createComponent.open(event);
  }
  
  onLoadExperiment(event: MouseEvent) {
    this.loadComponent.open(event);
  }

  onGoToSettings() {
    const tab = this.tabFactory.create(['settings']);
    this.goToTab(tab);
  }

  onGoToPackages() {
    const tab = this.tabFactory.create(['package']);
    this.goToTab(tab);
  }
  
  private goToTab(tab: Tab) {
    if (this.routerService.current() === '/') {
      this.tabService.openTab(tab);
    } else {
      this.tabService.replaceTab(this.routerService.current(), tab);
    }
  }

  ngOnDestroy() {
    this.workspaceService.set('/welcome', { selected: this.selected });
    this.shortcutService.unsubscribe('arrowup', this.onMoveUp);
    this.shortcutService.unsubscribe('arrowdown', this.onMoveDown);
    this.shortcutService.unsubscribe('enter', this.onEnter);
  }

}
