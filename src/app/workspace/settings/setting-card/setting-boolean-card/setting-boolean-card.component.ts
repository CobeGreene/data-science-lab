import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Setting } from '../../../../../../shared/models';

@Component({
  selector: 'app-setting-boolean-card',
  templateUrl: './setting-boolean-card.component.html',
  styleUrls: ['./setting-boolean-card.component.css']
})
export class SettingBooleanCardComponent implements OnInit {

  @Input() setting: Setting;

  @Output() emitChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  onChange(value: boolean) {
    this.emitChange.emit(value);
  }

}
