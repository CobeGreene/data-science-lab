import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { Shortcut } from '../../../../shared/models';
import { ShortcutService } from '../../services/shortcut-service';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { EditShortcutComponent } from '../../shared/edit-shortcut/edit-shortcut.component';
import { FocusService } from '../../services/focus-service';
import { FocusAreas } from '../../constants';
import { Shortcuts } from '../../../../shared/shortcuts';

@Component({
  selector: 'app-shortcuts',
  templateUrl: './shortcuts.component.html',
  styleUrls: ['./shortcuts.component.css']
})
export class ShortcutsComponent implements OnInit, OnDestroy, AfterViewInit {

  shortcuts: Shortcut[];
  selected: number;
  inFocus: boolean;

  @ViewChild('editCmp', { static: false }) editComponent: EditShortcutComponent;

  constructor(
    private focusService: FocusService,
    private shortcutService: ShortcutService
    ) { }

  ngOnInit() {
    this.focusService.focusChanged
      .pipe(untilComponentDestroyed(this))
      .subscribe((value) => {
        this.inFocus = value === FocusAreas.Workspace;
      });
    this.inFocus = this.focusService.current() === FocusAreas.Workspace;
    
    this.shortcutService.shortcutChanged
      .pipe(untilComponentDestroyed(this))
      .subscribe(() => {
        this.shortcuts = this.shortcutService.all();
      });

      this.shortcuts = this.shortcutService.all();
      this.selected = 0;
  }

  ngAfterViewInit() {
    this.shortcutService.subscribe(Shortcuts.ArrowUp, this.onMoveUp);
    this.shortcutService.subscribe(Shortcuts.ArrowDown, this.onMoveDown);
    this.shortcutService.subscribe(Shortcuts.Enter, this.onEnter);
  }

  ngOnDestroy() {
    this.shortcutService.unsubscribe(Shortcuts.ArrowUp, this.onMoveUp);
    this.shortcutService.unsubscribe(Shortcuts.ArrowDown, this.onMoveDown);
    this.shortcutService.unsubscribe(Shortcuts.Enter, this.onEnter);
  }

  onMoveUp = () => {
    if (this.inFocus) {
      if (this.selected > 0) {
        this.selected -= 1;
      }
    }
  }

  onMoveDown = () => {
    if (this.inFocus) {
      if (this.selected < this.shortcuts.length - 1) {
        this.selected += 1;
      } 
    }
  }

  onEnter = () => {
    if (this.inFocus) {
      this.onEdit(new MouseEvent('click'), this.shortcuts[this.selected].key);
    }
  }

  onRestore(i: number) {
    const shortcut = this.shortcuts[i];
    const find = this.shortcuts.find((value) => value.value === shortcut.default);
    if (find !== undefined) {
      find.value = undefined;
      this.shortcutService.update(find);
    }
    shortcut.value = shortcut.default;
    this.shortcutService.update(shortcut);
  }

  onEdit(event: MouseEvent, key: string) {
    this.editComponent.open(event, key);
  }

}
