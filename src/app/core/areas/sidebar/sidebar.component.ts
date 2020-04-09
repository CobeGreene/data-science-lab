import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { ShortcutService } from '../../../services/shortcut-service';
import { FocusService } from '../../../services/focus-service';
import { TabFactory } from '../../../factory/tab-factory';
import { TabService } from '../../../services/tab-service';
import { FocusAreas } from '../../../constants';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { DropdownComponent } from '../../../shared/dropdown/dropdown.component';
import { Shortcuts } from '../../../../../shared/shortcuts';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, AfterViewInit, OnDestroy {

  lastSelected = 'experiments';
  choice = 'experiments';
  isExpanded: boolean;
  inFocus: boolean;


  @ViewChild('settingsCmp', { static: false }) settingsComponent: DropdownComponent;

  constructor(
    private shortcutService: ShortcutService,
    private tabFactory: TabFactory,
    private tabService: TabService,
    private focusService: FocusService) { }

  ngOnInit() {
    this.focusService.focusChanged
      .pipe(untilComponentDestroyed(this))
      .subscribe((value) => {
        this.inFocus = value === FocusAreas.Sidebar;
        if (this.inFocus) {
          this.isExpanded = true;
        }
      });

    this.inFocus = this.focusService.current() === FocusAreas.Sidebar;
    this.isExpanded = true;

  }


  ngAfterViewInit() {
    this.shortcutService.subscribe(Shortcuts.ToggleSidebarExperiments, this.onPickExperiments);
    this.shortcutService.subscribe(Shortcuts.ToggleSidebarPackages, this.onPickPackages);
    this.shortcutService.subscribe(Shortcuts.ToggleSidebarAlgorithms, this.onPickAlgorithms);
    this.shortcutService.subscribe(Shortcuts.ToggleSidebar, this.onToggleSidebar);
  }
  
  ngOnDestroy() {
    this.shortcutService.unsubscribe(Shortcuts.ToggleSidebarExperiments, this.onPickExperiments);
    this.shortcutService.unsubscribe(Shortcuts.ToggleSidebarPackages, this.onPickPackages);
    this.shortcutService.unsubscribe(Shortcuts.ToggleSidebarAlgorithms, this.onPickAlgorithms);
    this.shortcutService.unsubscribe(Shortcuts.ToggleSidebar, this.onToggleSidebar);
  }

  onPickExperiments = () => {
    this.onPick('experiments');
  }

  onPickPackages = () => {
    this.onPick('packages');
  }

  onPickAlgorithms = () => {
    this.onPick('algorithms');
  }


  onPick(choice: string, event?: MouseEvent) {
    if (this.isExpanded) {
      if (this.inFocus) {
        if (this.choice === choice) {
          this.onToggleSidebar();
        } else {
          this.choice = choice;
        }
      } else {
        this.choice = choice;
        this.focusService.set(FocusAreas.Sidebar);
      }
    } else {
      this.choice = choice;
      this.focusService.set(FocusAreas.Sidebar);
    }

    if (event) {
      event.stopPropagation();
    }
  }

  onToggleSidebar = () => {
    if (this.choice === 'none') {
      this.onPick(this.lastSelected);
    } else {
      this.lastSelected = this.choice;
      this.choice = 'none';
      this.isExpanded = false;
      this.focusService.pop();
    }
  }

  onSettingsClick() {
    const tab = this.tabFactory.create(['settings']);
    this.tabService.openTab(tab);
  }

  onWelcomeClick() {
    const tab = this.tabFactory.create(['welcome']);
    this.tabService.openTab(tab);
  }

  onShortcutsClick() {
    const tab = this.tabFactory.create(['shortcuts']);
    this.tabService.openTab(tab);
  }

  onSettingsContext(event: MouseEvent) {
    this.settingsComponent.open(event);
  }

}
