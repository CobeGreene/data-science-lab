import { Component, OnInit, ElementRef, QueryList, ViewChildren, HostListener, OnDestroy, AfterViewInit } from '@angular/core';
import { Experiment, ExperimentState } from '../../../../../../shared/models';
import { FocusService } from '../../../../services/focus-service';
import { FocusAreas } from '../../../../constants';
import { ExperimentService } from '../../../../services/experiment-service/experiment.service';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { ShortcutService } from '../../../../services/shortcut-service';
import { SidebarService } from '../../../../services/sidebar-service';
import { TabService } from '../../../../services/tab-service';
import { TabFactory } from '../../../../factory/tab-factory';
import { Shortcuts } from '../../../../../../shared/shortcuts';

interface SidebarExperimentData {
  openExperiments: boolean;
  openSelected: number;
  savedExperiments: boolean;
  savedSelected: number;
  selected: number;
  inFocus?: boolean;
}

@Component({
  selector: 'app-sidebar-experiment',
  templateUrl: './sidebar-experiment.component.html',
  styleUrls: ['./sidebar-experiment.component.css']
})
export class SidebarExperimentComponent implements OnInit, AfterViewInit, OnDestroy {

  data: SidebarExperimentData;

  openExperiments: Experiment[];
  savedExperiments: Experiment[];

  @ViewChildren('experimentCmp', { read: ElementRef }) experimentComponents: QueryList<ElementRef<HTMLElement>>;

  constructor(
    private focusService: FocusService,
    private sidebarService: SidebarService,
    private shortcutService: ShortcutService,
    private tabFactory: TabFactory,
    private tabService: TabService,
    private experimentService: ExperimentService) { }

  @HostListener('click', ['$event']) onFocusSidebar(event: MouseEvent) {
    this.focusService.set(FocusAreas.Sidebar);
    event.stopPropagation();
  }

  ngOnInit() {
    this.data = this.sidebarService.get<SidebarExperimentData>('sidebar-experiment',
      {
        openExperiments: false,
        openSelected: 0,
        savedExperiments: false,
        savedSelected: 0,
        selected: 0,
      });


    this.focusService.focusChanged
      .pipe(untilComponentDestroyed(this))
      .subscribe((value) => {
        this.data.inFocus = value === FocusAreas.Sidebar;
      });

    this.data.inFocus = this.focusService.current() === FocusAreas.Sidebar;

    this.experimentService.experimentsChanged
      .pipe(untilComponentDestroyed(this))
      .subscribe(() => {
        this.initializeExperiment();
      });

    this.experimentService.experimentLoaded
      .pipe(untilComponentDestroyed(this))
      .subscribe(() => {
        this.initializeExperiment();
      });

    this.initializeExperiment();
  }

  ngAfterViewInit() {
    this.shortcutService.subscribe(Shortcuts.ArrowUp, this.onMoveUp);
    this.shortcutService.subscribe(Shortcuts.ArrowDown, this.onMoveDown);
    this.shortcutService.subscribe(Shortcuts.ArrowLeft, this.onClose);
    this.shortcutService.subscribe(Shortcuts.ArrowRight, this.onOpen);
    this.shortcutService.subscribe(Shortcuts.Enter, this.onEnter);
  }

  ngOnDestroy() {
    this.shortcutService.unsubscribe(Shortcuts.ArrowUp, this.onMoveUp);
    this.shortcutService.unsubscribe(Shortcuts.ArrowDown, this.onMoveDown);
    this.shortcutService.unsubscribe(Shortcuts.ArrowLeft, this.onClose);
    this.shortcutService.unsubscribe(Shortcuts.ArrowRight, this.onOpen);
    this.shortcutService.unsubscribe(Shortcuts.Enter, this.onEnter);
    this.sidebarService.set('sidebar-experiment', this.data);
  }

  private initializeExperiment() {
    const experiments = this.experimentService.all();
    this.savedExperiments = experiments.filter((value) => value.state === ExperimentState.Unloaded);
    this.openExperiments = experiments.filter((value) => value.state !== ExperimentState.Unloaded);

    if (this.data.openSelected >= this.openExperiments.length && this.openExperiments.length !== 0) {
      this.data.openSelected = this.openExperiments.length -1;
    } else if (this.openExperiments.length === 0) {
      this.data.openSelected = 0;
    }
    
    if (this.data.savedSelected >= this.savedExperiments.length && this.savedExperiments.length !== 0) {
      this.data.savedSelected = this.savedExperiments.length -1;
    } else if (this.savedExperiments.length === 0) {
      this.data.savedSelected = 0;
    }

    setTimeout(() => {
      this.scrollIntoViewOpenSelected();
      this.scrollIntoViewSaveSelected();
    });
  }

  onToggleOpenExperiments(event: MouseEvent) {
    this.data.selected = 0;
    this.data.openExperiments = !this.data.openExperiments;
    this.focusService.set(FocusAreas.Sidebar);

    event.stopPropagation();
  }

  onToggleSaveExperiments(event: MouseEvent) {
    this.data.selected = 1;
    this.data.savedExperiments = !this.data.savedExperiments;
    this.focusService.set(FocusAreas.Sidebar);

    event.stopPropagation();
  }

  onMoveUp = () => {
    if (this.data.inFocus) {
      if (this.data.selected === 0 && this.data.openExperiments && this.data.openSelected > 0) {
        this.data.openSelected -= 1;
        this.scrollIntoViewOpenSelected();
      } else if (this.data.selected === 1) {
        if (!this.data.savedExperiments) {
          this.data.selected -= 1;
        } else if (this.data.savedSelected > 0 && this.savedExperiments.length !== 0) {
          this.data.savedSelected -= 1;
          this.scrollIntoViewSaveSelected();
        } else {
          this.data.selected -= 1;
          this.scrollIntoViewOpenSelected();
        }
      }
    }
  }

  onMoveDown = () => {
    if (this.data.inFocus) {
      if (this.data.selected === 1 && this.data.savedExperiments && this.data.savedSelected < this.savedExperiments.length - 1) {
        this.data.savedSelected += 1;
        this.scrollIntoViewSaveSelected();
      } else if (this.data.selected === 0) {
        if (!this.data.openExperiments) {
          this.data.selected += 1;
        } else if (this.data.openSelected < this.openExperiments.length - 1 && this.openExperiments.length !== 0) {
          this.data.openSelected += 1;
          this.scrollIntoViewOpenSelected();
        } else {
          this.data.selected += 1;
          this.scrollIntoViewSaveSelected();
        }
      }
    }
  }

  onOpen = () => {
    if (this.data.inFocus) {
      if (this.data.selected === 0) {
        this.data.openExperiments = true;
      } else if (this.data.selected === 1) {
        this.data.savedExperiments = true;
      }
    }
  }

  onClose = () => {
    if (this.data.inFocus) {
      if (this.data.selected === 0) {
        this.data.openExperiments = false;
      } else if (this.data.selected === 1) {
        this.data.savedExperiments = false;
      }
    }
  }

  onEnter = () => {
    if (this.data.inFocus) {
      if (this.data.selected === 0) {
        if (this.data.openExperiments) {
          this.onOpenSelected(this.data.openSelected);
        } else {
          this.data.openExperiments = true;
        }
      } else if (this.data.selected === 1) {
        if (this.data.savedExperiments) {
          this.onSaveSelected(this.data.savedSelected);
        } else {
          this.data.savedExperiments = true;
        }
      }
    }
  }

  onOpenSelected(selected: number) {
    this.data.selected = 0;
    this.data.openSelected = selected;

    if (this.data.openSelected < this.openExperiments.length) {
      this.scrollIntoViewOpenSelected();
  
      const tab = this.tabFactory.create(['experiment', this.openExperiments[selected].id]);
      this.tabService.openTab(tab);

    }

  }

  onSaveSelected(selected: number) {
    this.data.selected = 1;
    this.data.savedSelected = selected;

    if (this.data.savedSelected < this.savedExperiments.length) {
      this.scrollIntoViewSaveSelected();
      this.experimentService.load(this.savedExperiments[selected].id);
    }

  }

  scrollIntoViewOpenSelected() {
    this.scrollIntoViewSelected(this.data.openSelected);
  }

  scrollIntoViewSaveSelected() {
    this.scrollIntoViewSelected(this.data.savedSelected + this.openExperiments.length);
  }

  scrollIntoViewSelected(select: number) {
    const element = this.experimentComponents.toArray()[select];
    if (element !== undefined) {
      (element.nativeElement).scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'start' });
    }
  }

}
