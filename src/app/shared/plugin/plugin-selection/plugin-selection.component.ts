import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Plugin } from '../../../../../shared/models';
import { PluginSelectionListComponent } from './plugin-selection-list/plugin-selection-list.component';


@Component({
  selector: 'app-plugin-selection',
  templateUrl: './plugin-selection.component.html'
})
export class PluginSelectionComponent implements OnInit {

  @ViewChild('selectionListCmp', { static: false }) listComponent: PluginSelectionListComponent;

  private _plugins: Plugin[];

  get plugins(): Plugin[] {
    return this._plugins;
  }

  @Input() set plugins(plugins: Plugin[]) {
    this._plugins = plugins;
    setTimeout(() => {
      this.listComponent.onResized();
    });
  }

  @Output() emitPlugin = new EventEmitter<Plugin>();

  search: string;


  constructor() {
    this.search = '';
   }

  ngOnInit() {
  }

  onResized() {
    this.listComponent.onResized();
  }

  onSearch(search: string) {
    this.search = search;
    setTimeout(() => {
      this.listComponent.onResized();
    });
  }

  onSelect(event: Plugin) {
    this.emitPlugin.emit(event);
  }

}
