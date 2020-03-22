import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Plugin } from '../../../../../../../shared/models';

@Component({
  selector: 'app-plugin-selection-card',
  templateUrl: './plugin-selection-card.component.html',
  styleUrls: ['./plugin-selection-card.component.css']
})
export class PluginSelectionCardComponent implements OnInit {

  @Input() plugin: Plugin;
  @Output() emitSelect = new EventEmitter<Plugin>();

  constructor() { }

  ngOnInit() {
  }

  onSelect() {
    this.emitSelect.emit(this.plugin);
  }

}
