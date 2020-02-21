import { Component, OnInit, ViewChildren, ElementRef, QueryList, ChangeDetectorRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Tab } from '../../../models';
import { FocusAreas } from '../../../constants';
import { TabService } from '../../../services/tab-service';
import { ShortcutService } from '../../../services/shortcut-service';
import { FocusService } from '../../../services/focus-service';
import { RouterService } from '../../../services/router-service';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css']
})
export class TabsComponent implements OnInit, AfterViewInit, OnDestroy {

  tabs: Tab[];
  selected: number;

  currentDragTab: number;

  @ViewChildren('tabCmp', { read: ElementRef }) tabComponents: QueryList<ElementRef<HTMLElement>>;

  constructor(private tabService: TabService, private shortcutService: ShortcutService,
              private focusService: FocusService, 
              private routerService: RouterService,
              private ref: ChangeDetectorRef) {
    this.selected = -1;
  }

  private handleSelectTab() {
    this.routerService.navigate(this.tabs[this.selected].route, this.tabs[this.selected].data);
    this.scrollIntoViewSelected();
    this.focusService.set(FocusAreas.Workspace);
  }

  ngOnInit() {
    this.tabs = this.tabService.all();
    this.selected = this.tabs.length === 0 ? -1 : 0;

    this.tabService.tabsChanged
      .pipe(untilComponentDestroyed(this))
      .subscribe((tabs) => {
        this.tabs = tabs;
        this.ref.detectChanges();
        if (this.selected >= this.tabs.length) {
          this.selected = this.tabs.length - 1;
        }
        
        if (this.selected >= 0) {
          this.handleSelectTab();
        } else {
          this.routerService.navigate('/');
        }
      });

    this.tabService.tabOpened
      .pipe(untilComponentDestroyed(this))
      .subscribe((value) => {
        this.tabs = value.tabs;
        this.selected = value.index;

        this.ref.detectChanges();
        this.handleSelectTab();
      });

    this.tabService.tabReplaced
      .pipe(untilComponentDestroyed(this))
      .subscribe((value) => {
        this.tabs = value.tabs;
        this.selected = value.index;

        this.ref.detectChanges();
        this.handleSelectTab();
      });

    if (this.selected < 0) {
      this.routerService.navigate('/');
    }
  }

  ngAfterViewInit() {
    this.shortcutService.subscribe('ctrl + tab', this.onTabRight);
    this.shortcutService.subscribe('ctrl + shift + tab', this.onTabLeft);
    this.shortcutService.subscribe('ctrl + keyw', this.onCloseCmd);
  }

  ngOnDestroy() {
    this.shortcutService.unsubscribe('ctrl + tab', this.onTabRight);
    this.shortcutService.unsubscribe('ctrl + shift + tab', this.onTabLeft);
    this.shortcutService.unsubscribe('ctrl + keyw', this.onCloseCmd);
  }

  onTabRight = () => {
    if (this.tabs.length > 0) {
      if (this.selected + 1 >= this.tabs.length) {
        this.selected = 0;
      } else {
        this.selected += 1;
      }

      this.handleSelectTab();
    }

    this.focusService.set(FocusAreas.Workspace);
  }

  onTabLeft = () => {
    if (this.tabs.length > 0) {
      if (this.selected - 1 < 0) {
        this.selected = this.tabs.length - 1;
      } else {
        this.selected -= 1;
      }

      this.handleSelectTab();
    }

    this.focusService.set(FocusAreas.Workspace);
  }

  onCloseCmd = () => {
    this.tabService.removeTab(this.tabs[this.selected].route);
  }

  onSelected(event: MouseEvent, selected: number) {
    this.selected = selected;
    this.handleSelectTab();
    event.preventDefault();
  }

  scrollIntoViewSelected() {
    if (this.selected >= 0) {
      const element = this.tabComponents.toArray()[this.selected];
      (element.nativeElement).scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }

  onAllowDrop(ev: DragEvent) {
    ev.preventDefault();
  }

  onDrop(ev: DragEvent, event: string, tabIndex: number) {
    if (event === 'tabs') {
      ev.preventDefault();
      ev.stopPropagation();

      const tab = this.tabs.splice(this.currentDragTab, 1)[0];

      if (tabIndex >= 0) {
        this.tabs.splice(tabIndex, 0, tab);
        this.selected = tabIndex;
      } else {
        this.tabs.push(tab);
        this.selected = this.tabs.length - 1;
      }

      this.currentDragTab = -1;
      this.handleSelectTab();

    }
  }

  onDrag(_: DragEvent, tabIndex: number) {
    this.focusService.set(FocusAreas.Workspace);
    this.currentDragTab = tabIndex;
  }

}
