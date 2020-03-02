import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-plugin-next',
  templateUrl: './plugin-next.component.html',
  styleUrls: ['./plugin-next.component.css']
})
export class PluginNextComponent implements OnInit {

  @Input() valid: boolean;
  @Input() isWaiting: boolean;

  @Output() emitNext = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
  }

  onNext() {
    this.emitNext.next();
  }

}
