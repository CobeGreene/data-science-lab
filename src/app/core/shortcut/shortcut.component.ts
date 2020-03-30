import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ShortcutService } from '../../services/shortcut-service';

@Component({
  selector: 'app-shortcut',
  template: '',
})
export class ShortcutComponent implements OnInit, AfterViewInit {

  // start with
  // without or without modifiers like shift, alt, and ctrl
  readonly allCombos: string[] = ['escape', 'f', 'insert', 'tab', 'enter',
    'home', 'end'
  ];
  // exclude key, but include shift + key
  readonly mustModifier: string[] = ['delete', 'backspace', 'pageup',
    'pagedown'
  ];
  // exclude key and shift + key, but include ctrl + key, alt + key,
  readonly mustCtrlAltModifier: string[] = ['backquote',
    'digit', 'minus', 'equal', 'key', 'bracket',
    'backslash', 'semicolon', 'quote', 'comma', 'period', 'slash',
    'numpad'
  ];

  constructor(
    private shortcutService: ShortcutService
  ) {

  }

  onKeydown = (event: KeyboardEvent): void => {
    const shortcut = this.getShortcut(event);
    if (event.code.toLowerCase().startsWith('arrow')) {
      this.shortcutService.run(shortcut);
    }
  }

  onKeyup = (event: KeyboardEvent): void => {
    const shortcut = this.getShortcut(event);
    const code = event.code.toLowerCase();
    if (this.allCombos.findIndex(str => code.startsWith(str)) >= 0) {
      this.shortcutService.run(shortcut);
    } else if (
      this.mustCtrlAltModifier.findIndex(str => code.startsWith(str)) >= 0 &&
      (event.altKey || event.ctrlKey)) {
      this.shortcutService.run(shortcut);
    } else if (this.mustModifier.findIndex(str => code.startsWith(str)) >= 0 &&
      (event.shiftKey || event.altKey || event.ctrlKey)) {
      this.shortcutService.run(shortcut);
    }
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    document.addEventListener('keyup', this.onKeyup, true);
    document.addEventListener('keydown', this.onKeydown, true);
  }

  getShortcut(event: KeyboardEvent): string {
    // tslint:disable-next-line: deprecation
    let shortcut = '';
    if (event.ctrlKey && event.key !== 'Control') {
      shortcut += 'ctrl + ';
    }
    if (event.altKey && event.key !== 'Alt') {
      shortcut += 'alt + ';
    }
    if (event.shiftKey && event.key !== 'Shift') {
      shortcut += 'shift + ';
    }

    shortcut += event.code.toLocaleLowerCase();

    return shortcut;
  }

}
