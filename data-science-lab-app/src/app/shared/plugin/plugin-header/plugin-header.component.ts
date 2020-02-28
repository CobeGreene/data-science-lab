import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-plugin-header',
  templateUrl: './plugin-header.component.html',
  styleUrls: ['./plugin-header.component.css']
})
export class PluginHeaderComponent implements OnInit {

  @Output() emitReturn = new EventEmitter<void>();
  @Output() emitExit = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
  }

  onReturn() {
    this.emitReturn.emit();
  }

  onExit() {
    this.emitExit.emit();
  }

}
