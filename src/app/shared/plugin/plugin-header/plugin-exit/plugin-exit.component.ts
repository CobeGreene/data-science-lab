import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-plugin-exit',
  templateUrl: './plugin-exit.component.html',
  styleUrls: ['./plugin-exit.component.css']
})
export class PluginExitComponent implements OnInit {

  @Output() emitExit = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
  }

  onExit() {
    this.emitExit.emit();
  }

}
