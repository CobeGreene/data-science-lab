import { Component, OnInit } from '@angular/core';
import { ShortcutInput } from 'ng-keyboard-shortcuts';
import { ShortcutService } from '../../services/shortcut-service';

@Component({
  selector: 'app-shortcut',
  templateUrl: './shortcut.component.html',
  styleUrls: ['./shortcut.component.css']
})
export class ShortcutComponent implements OnInit {

  shortcuts: ShortcutInput[];

  constructor(private shortcutService: ShortcutService) {
  }

  ngOnInit() {
    this.shortcuts = this.shortcutService.shortcuts;
  }

}
