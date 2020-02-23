import { Component, OnInit, AfterViewInit } from '@angular/core';
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

  onKeypress = (event: KeyboardEvent): void => {
    const shortcut = this.getShortcut(event);
    this.shortcutService.runAction(shortcut);
  }
  
  onKeyup = (event: KeyboardEvent): void => {
    
    const lowercase = event.key.toLowerCase();
    if (lowercase === 'escape' || lowercase.startsWith('f') || lowercase.startsWith('arrow')) {
      const shortcut = this.getShortcut(event);
      this.shortcutService.runAction(shortcut);
    }
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    document.addEventListener('keypress', this.onKeypress, true);
    document.addEventListener('keyup', this.onKeyup, true);
  }

  getShortcut(event: KeyboardEvent): string {
    // tslint:disable-next-line: deprecation
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

    shortcut += event.code.toLocaleLowerCase();

    return shortcut;
  }

}
