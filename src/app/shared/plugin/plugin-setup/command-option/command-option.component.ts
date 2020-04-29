import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommandOption } from 'data-science-lab-core';

@Component({
  selector: 'app-command-option',
  templateUrl: './command-option.component.html',
})
export class CommandOptionComponent implements OnInit {

  @Input() option: CommandOption;

  @Output() emitCommand = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  onCommand() {
    this.emitCommand.next(this.option.id);
  }

}
