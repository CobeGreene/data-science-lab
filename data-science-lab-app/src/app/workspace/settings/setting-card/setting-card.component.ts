import { Component, OnInit, Input } from '@angular/core';
import { Setting } from '../../../../../shared/models';

@Component({
  selector: 'app-setting-card',
  templateUrl: './setting-card.component.html',
  styleUrls: ['./setting-card.component.css']
})
export class SettingCardComponent implements OnInit {

  @Input() setting: Setting;

  constructor() { }

  ngOnInit() {
  }

}
