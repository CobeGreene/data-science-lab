import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-plugin-return',
  templateUrl: './plugin-return.component.html',
  styleUrls: ['./plugin-return.component.css']
})
export class PluginReturnComponent implements OnInit {

  @Output() emitReturn = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
  }

  onReturn() {
    this.emitReturn.emit();
  }

}
