import { Component, OnInit } from '@angular/core';
import { Setting } from '../../../../shared/models';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  settings: Setting[];

  constructor() {
    this.settings = [];
   }

  ngOnInit() {
  }

}
