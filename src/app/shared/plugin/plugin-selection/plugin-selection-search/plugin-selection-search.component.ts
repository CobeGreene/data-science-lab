import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-plugin-selection-search',
  templateUrl: './plugin-selection-search.component.html',
  styleUrls: ['./plugin-selection-search.component.css']
})
export class PluginSelectionSearchComponent implements OnInit {

  @Output() emitSearch = new EventEmitter<string>(); 

  search: string;

  constructor() { }

  ngOnInit() {
  }

  onChange() {
    this.emitSearch.emit(this.search);
  }

}
