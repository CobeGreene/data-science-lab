import { Component, OnInit, HostListener, AfterViewInit, Input } from '@angular/core';
import { ShortcutService } from '../../services/shortcut-service';

@Component({
  selector: 'app-shortcut',
  template: '',
})
export class ShortcutComponent implements OnInit, AfterViewInit {

  constructor(
    private shortcutService: ShortcutService
  ) {

  }

  onKeyup = (event: KeyboardEvent): void => {
    const shortcut = this.getShortcut(event);
    this.shortcutService.runAction(shortcut);
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    window.addEventListener('keyup', this.onKeyup, true);
  }

  getShortcut(event: KeyboardEvent): string {
    let shortcut = '';
    if (event.ctrlKey && event.key !== 'Control') {
      shortcut += 'ctrl + ';
    }
    if (event.shiftKey && event.key !== 'Shift') {
      shortcut += 'shift + ';
    }
    if (event.altKey && event.key !== 'Alt') {
      shortcut += 'alt + ';
    }

    shortcut += event.key.toLocaleLowerCase();

    return shortcut;
  }

}
